import { useEffect, useState } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import ModalConfirmacao from '../../components/ModalConfirmacao';
import PageTitulo from '../../components/global/PageTitulo';
import BarraBusca from '../../components/global/BarraBusca';
import BotaoCadastro from '../../components/global/BotaoCadastro';
import BotõesAcao from '../../components/global/BotoesAcao';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import EnderecoService from '../../services/EnderecoService';

const EnderecoList = () => {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para o Modal de Exclusão
  const [showModal, setShowModal] = useState(false);
  const [enderecoToDelete, setEnderecoToDelete] = useState(null);

  // Carrega os dados ao montar o componente 
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchEnderecos(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchEnderecos = async (termo = '') => {
    try {
      setLoading(true);
      // O endpoint findAll retorna um Page, pegamos o .content
      const data = await EnderecoService.findAll(0, 10, termo);
      setEnderecos(data.content || []); 
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
        fetchEnderecos(searchTerm); // Recarrega a lista
      } catch (err) {
        alert('Erro ao excluir endereço.');
      }
    }
  };

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
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <BotaoCadastro para="/enderecos/novo" texto="Novo Endereço" />
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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