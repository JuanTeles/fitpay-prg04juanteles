import React, { useEffect, useState } from 'react';
import { Container, Table, Card, Badge, Alert } from 'react-bootstrap';
import PageTitulo from '../../components/global/PageTitulo';
import BotaoCadastro from '../../components/global/BotaoCadastro';
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
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">
        <PageTitulo titulo="Financeiro" descricao="Gestão de pagamentos" />
        <BotaoCadastro para="/financeiro/novo" texto="Novo Pagamento" />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <CarregandoSpinner mensagem="Carregando pagamentos..." />
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Data</th>
                  <th>Referência</th>
                  <th>Valor</th>
                  <th>Método</th>
                  <th>Aluno (Contrato)</th>
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
                      <td>{pag.data_pagamento}</td>
                      <td>{pag.referencia_periodo}</td>
                      <td className="fw-bold text-success">
                        R$ {pag.valor_pago?.toFixed(2)}
                      </td>
                      <td>
                        <Badge bg="info">{pag.metodo_pagamento}</Badge>
                      </td>
                      <td>Contrato #{pag.contrato_aluno?.id || pag.contrato_id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PagamentoList;
