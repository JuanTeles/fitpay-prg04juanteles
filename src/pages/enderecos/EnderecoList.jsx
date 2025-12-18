import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import ModalConfirmacao from '../../components/ModalConfirmacao';
import EnderecoService from '../../services/EnderecoService';

const EnderecoList = () => {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o Modal de Exclusão
  const [showModal, setShowModal] = useState(false);
  const [enderecoToDelete, setEnderecoToDelete] = useState(null);

  // Carrega os dados ao montar o componente
  useEffect(() => {
    fetchEnderecos();
  }, []);

  const fetchEnderecos = async () => {
    try {
      setLoading(true);
      // O endpoint findAll retorna um Page, pegamos o .content
      const data = await EnderecoService.findAll();
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
        fetchEnderecos(); // Recarrega a lista
      } catch (err) {
        alert('Erro ao excluir endereço.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Carregando endereços...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-midnight">Gerenciar Endereços</h2>
        <Link to="/enderecos/novo">
          <Button variant="primary" className="fw-bold shadow-sm">
            <i className="bi bi-plus-lg me-2"></i>Novo Endereço
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    Nenhum endereço cadastrado.
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
                      <Link to={`/enderecos/editar/${end.id}`}>
                        <Button variant="link" className="text-primary p-0 me-3" title="Editar">
                          <i className="bi bi-pencil-square fs-5"></i>
                        </Button>
                      </Link>
                      <Button 
                        variant="link" 
                        className="text-danger p-0" 
                        title="Excluir"
                        onClick={() => confirmDelete(end.id)}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

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