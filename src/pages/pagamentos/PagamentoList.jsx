import { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Alert, Form, Card } from 'react-bootstrap';
import PageTitulo from '../../components/global/PageTitulo';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import BarraBusca from '../../components/global/BarraBusca';
import PagamentoService from '../../services/PagamentoService';

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [metodoFilter, setMetodoFilter] = useState('');

  // Função memoizada para evitar warning do ESLint
  const carregarPagamentos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PagamentoService.findAll(
        0,
        20,
        searchTerm,
        metodoFilter
      );
      setPagamentos(data.content || []);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar pagamentos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, metodoFilter]);

  useEffect(() => {
    // Debounce para evitar múltiplas chamadas enquanto o usuário digita
    const timer = setTimeout(() => {
      carregarPagamentos();
    }, 500);

    return () => clearTimeout(timer);
  }, [carregarPagamentos]);

  return (
    <Container className="py-5">
      {/* Cabeçalho Responsivo */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">

        {/* LADO ESQUERDO: Título */}
        <PageTitulo titulo="Pagamentos" descricao="Gestão de pagamentos" />

        {/* LADO DIREITO: Filtros */}
        <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center w-100 w-lg-auto">

          {/* FILTRO MÉTODO */}
          <Form.Select
            value={metodoFilter}
            onChange={(e) => setMetodoFilter(e.target.value)}
            style={{ minWidth: '150px' }}
            className="shadow-sm"
          >
            <option value="">Todos Métodos</option>
            <option value="PIX">PIX</option>
            <option value="CARTAO">Cartão</option>
            <option value="DINHEIRO">Dinheiro</option>
          </Form.Select>

          {/* BUSCA POR NOME */}
          <BarraBusca
            placeholder="Pesquisar por nome do aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ALERTA DE ERRO */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* TABELA */}
      {loading ? (
        <CarregandoSpinner mensagem="Carregando pagamentos..." />
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light text-secondary">
                <tr>
                  <th className='ps-4'>ID</th>
                  <th>Aluno</th>
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
                    colSpan="6"
                    mensagemVazia="Nenhum pagamento registrado no sistema."
                    temFiltro={searchTerm || metodoFilter}
                  />
                ) : (
                  pagamentos.map((pag) => (
                    <tr key={pag.id}>
                      <td className="ps-4 text-muted">#{pag.id}</td>
                      <td className="fw-semibold">
                        {pag.matricula?.aluno?.nome
                          ? pag.matricula.aluno.nome.split(' ')[0]
                          : 'N/A'}
                      </td>
                      <td>
                        {pag.data_pagamento
                          ? new Date(pag.data_pagamento).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td>{pag.referencia_periodo}</td>
                      <td className="fw-bold text-success">
                        {pag.valor_pago?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </td>
                      <td className='text-end pe-4'>
                        <Badge bg={pag.metodo_pagamento === 'DINHEIRO' ? 'success' : 'primary'}>
                          {pag.metodo_pagamento}
                        </Badge>
                      </td>
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
