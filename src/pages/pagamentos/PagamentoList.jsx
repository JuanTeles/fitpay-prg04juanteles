import { useEffect, useState } from 'react';
import { Container, Table, Badge, Alert } from 'react-bootstrap';
import PageTitulo from '../../components/global/PageTitulo';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import PagamentoService from '../../services/PagamentoService';

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      const data = await PagamentoService.findAll(0, 20);
      setPagamentos(data.content || []);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar pagamentos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center mb-4 gap-3">
        <PageTitulo titulo="Pagamentos" descricao="Gestão de pagamentos" />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <CarregandoSpinner mensagem="Carregando pagamentos..." />
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light text-secondary">
                <tr>
                  <th className='ps-4'>ID Pagamento</th>
                  <th>Data</th>
                  <th>Referência</th>
                  <th>Valor</th>
                  <th className="text-end pe-4">Método</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.length === 0 ? (
                  <EstadoVazio 
                    icone="bi-wallet2" 
                    colSpan="5" 
                    mensagemVazia="Nenhum pagamento registrado."
                  />
                ) : (
                  pagamentos.map((pag) => (
                    <tr key={pag.id}>
                      <td className="ps-4">#{pag.id || pag.contrato_id}</td>
                      <td>{pag.data_pagamento}</td>
                      <td>{pag.referencia_periodo}</td>
                      <td className="fw-bold text-success">
                        {pag.valor_pago?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className='text-end pe-4'>
                        <Badge bg="info">{pag.metodo_pagamento}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PagamentoList;
