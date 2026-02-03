import { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Alert, Form, Card, Pagination } from 'react-bootstrap'; // Pagination adicionado
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

  // Estados para Paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Função memoizada para evitar warning do ESLint
  // Atualizada para receber page (ou usar o estado currentPage)
  const carregarPagamentos = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      // Passa a página dinâmica. 
      const data = await PagamentoService.findAll(
        page,
        12,
        searchTerm,
        metodoFilter
      );
      setPagamentos(data.content || []);
      setTotalPages(data.totalPages); // Atualiza total de páginas
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
      carregarPagamentos(currentPage);
    }, 500);

    return () => clearTimeout(timer);
  }, [carregarPagamentos, currentPage]); 

  // LÓGICA DE PAGINAÇÃO (Max 5 botões)
  const maxButtons = 5;
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 3);

  if (totalPages > maxButtons) {
      if (currentPage <= 2) {
          startPage = 0;
          endPage = maxButtons;
      } else if (currentPage + 2 >= totalPages) {
          startPage = totalPages - maxButtons;
          endPage = totalPages;
      }
  } else {
      startPage = 0;
      endPage = totalPages;
  }

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
            onChange={(e) => {
                setMetodoFilter(e.target.value);
                setCurrentPage(0); // Reseta página ao filtrar
            }}
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
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0); // Reseta página ao buscar
            }}
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

      {/* Componente de Paginação */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
            <Pagination>
                <Pagination.First 
                    onClick={() => setCurrentPage(0)} 
                    disabled={currentPage === 0} 
                />
                <Pagination.Prev 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
                    disabled={currentPage === 0} 
                />
                
                {[...Array(endPage - startPage)].map((_, i) => {
                    const pageIndex = startPage + i;
                    return (
                        <Pagination.Item 
                            key={pageIndex} 
                            active={pageIndex === currentPage}
                            onClick={() => setCurrentPage(pageIndex)}
                        >
                            {pageIndex + 1}
                        </Pagination.Item>
                    );
                })}
                
                <Pagination.Next 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} 
                    disabled={currentPage === totalPages - 1} 
                />
                <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages - 1)} 
                    disabled={currentPage === totalPages - 1} 
                />
            </Pagination>
        </div>
      )}
    </Container>
  );
};

export default PagamentoList;