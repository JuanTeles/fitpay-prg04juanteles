import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Form } from 'react-bootstrap';
import ModalConfirmacao from '../../components/ModalConfirmacao';
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
        {/* Título: Centralizado no mobile, esquerda no desktop */}
        <div className="text-center text-lg-start w-100 w-lg-auto">
            <h2 className="fw-bold text-midnight">Gerenciar Endereços</h2>
        </div>
        
        {/* Controles */}
        <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center w-100 w-lg-auto">
            <Form.Control
                type="text"
                placeholder="Pesquisar endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '280px' }}
            />
            {/* Link/Botão */}
            <Link to="/enderecos/novo" className="d-block d-md-inline-block">
                <Button variant="primary" className="fw-bold shadow-sm text-nowrap w-100 w-md-auto">
                    <i className="bi bi-plus-lg me-2"></i>Novo Endereço
                </Button>
            </Link>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Carregando endereços...</p>
        </Container>
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
                    <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                        <i className="bi bi-geo-alt fs-1 d-block mb-2"></i>
                        {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum endereço cadastrado.'}
                    </td>
                    </tr>
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
                            <div className="d-flex align-items-center justify-content-end gap-3">
                                {/* Botão Editar: Link direto (sem button dentro) */}
                                <Link to={`/enderecos/editar/${end.id}`} className="text-primary" title="Editar">
                                    <i className="bi bi-pencil-square fs-5"></i>
                                </Link>

                                {/* Botão Excluir: Botão limpo */}
                                <Button 
                                    variant="link" 
                                    className="text-danger p-0 border-0" 
                                    title="Excluir"
                                    onClick={() => confirmDelete(end.id)}
                                >
                                    <i className="bi bi-trash fs-5"></i>
                                </Button>
                            </div>
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