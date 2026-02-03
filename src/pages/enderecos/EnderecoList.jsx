import { useEffect, useState } from 'react';
import { Container, Table, Alert, Pagination } from 'react-bootstrap'; // Adicionado Pagination
import ModalConfirmacao from '../../components/global/ModalConfirmacao';
import PageTitulo from '../../components/global/PageTitulo';
import BarraBusca from '../../components/global/BarraBusca';
import BotaoCadastro from '../../components/global/BotaoCadastro';
import BotõesAcao from '../../components/global/BotoesAcao';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import EnderecoService from '../../services/EnderecoService';

const EnderecoList = () => {
  
  useEffect(() => {
      document.title = "Endereços - FitPay"; // Define o título da guia
  }, []);

  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Estados para o Modal de Exclusão
  const [showModal, setShowModal] = useState(false);
  const [enderecoToDelete, setEnderecoToDelete] = useState(null);

  // Carrega os dados ao montar o componente e ao mudar página/busca
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchEnderecos(currentPage, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  const fetchEnderecos = async (page = 0, termo = '') => {
    try {
      setLoading(true);
      // Passa a página dinâmica. Mantive 10 itens por página.
      const data = await EnderecoService.findAll(page, 10, termo);
      setEnderecos(data.content || []); 
      setTotalPages(data.totalPages); // Atualiza o total de páginas
      setError(null);
    } catch (err) {
      setError('Erro ao carregar endereços. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal de confirmação
  const confirmDelete = (id) => {
    setEnderecoToDelete(id);
    setShowModal(true);
  };

  // Executa a exclusão real
  const handleDelete = async () => {
    if (enderecoToDelete) {
      try {
        await EnderecoService.delete(enderecoToDelete);
        setShowModal(false);
        setEnderecoToDelete(null);
        fetchEnderecos(currentPage, searchTerm); // Recarrega na página atual
        setError(null); 
      } catch (err) {
        setError('Não foi possível excluir o endereço. Ele pode estar vinculado a um aluno.');
        setShowModal(false);
      }
    }
  };

  // --- LÓGICA DE PAGINAÇÃO (Max 5 botões) ---
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
        {/* Título */}
        <PageTitulo titulo="Gerenciar Endereços" />
        
        {/* Controles */}
        <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center w-100 w-lg-auto">
            <BarraBusca
                placeholder="Pesquisar endereço..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0); // Reseta página ao buscar
                }}
            />
            <BotaoCadastro para="/enderecos/novo" texto="Novo Endereço" />
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
        </Alert>
      )}

      {loading ? (
        <CarregandoSpinner mensagem="Carregando endereços..." />
      ) : (
        <div className="card shadow-sm border-0">
            <div className="card-body p-0">
            <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                <tr>
                    <th className="ps-4">Logradouro</th>
                    <th>Bairro</th>
                    <th>Cidade/UF</th>
                    <th>CEP</th>
                    <th className="text-end pe-4">Ações</th>
                </tr>
                </thead>
                <tbody>
                {enderecos.length === 0 ? (
                    <EstadoVazio 
                        icone="bi-geo-alt" 
                        colSpan="5" 
                        mensagemVazia="Nenhum endereço cadastrado."
                        temFiltro={searchTerm}
                    />
                ) : (
                    enderecos.map((end) => (
                    <tr key={end.id}>
                        <td className="ps-4 fw-semibold">
                        {end.logradouro}, {end.numero}
                        {end.complemento && <small className="d-block text-muted">{end.complemento}</small>}
                        </td>
                        <td>{end.bairro}</td>
                        <td>{end.cidade} / {end.uf}</td>
                        <td>{end.cep}</td>
                        <td className="text-end pe-4">
                            <BotõesAcao 
                                id={end.id}
                                rotaEditar={`/enderecos/editar/${end.id}`}
                                onDelete={confirmDelete}
                            />
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </Table>
            </div>
        </div>
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

      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmacao
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDelete}
        titulo="Confirmar Exclusão"
        mensagem="Tem certeza que deseja excluir este endereço? Essa ação não pode ser desfeita."
      />

    </Container>
  );
};

export default EnderecoList;