import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import EnderecoService from '../../services/EnderecoService';
import EnderecoCampos from '../../components/EnderecoCampos';

const EnderecoForm = () => {
  const { id } = useParams(); // Pega o ID da rota (se houver)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Se tiver ID, carrega os dados para edição
  useEffect(() => {
    if (id) {
      loadEndereco(id);
    }
  }, [id]);

  const loadEndereco = async (enderecoId) => {
    try {
      setLoading(true);
      const data = await EnderecoService.findById(enderecoId); 
      setFormData(data);
    } catch (err) {
      setError('Erro ao carregar os dados do endereço.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Limpeza básica do payload
      const payload = {
        ...formData,
        cep: formData.cep.replace(/\D/g, '') // Envia apenas números para a API
      };

      if (id) {
        await EnderecoService.update({ ...payload, id }); 
      } else {
        await EnderecoService.save(payload);
      }
      navigate('/enderecos'); // Volta para a lista
    } catch (err) {
      console.error(err);
      // Tenta pegar a mensagem de erro do backend (ex: BusinessException)
      const msg = err.response?.data?.message || 'Ocorreu um erro ao salvar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Carregando dados...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-midnight">
          {id ? 'Editar Endereço' : 'Novo Endereço'}
        </h2>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <Form onSubmit={handleSubmit}>
            
            <EnderecoCampos 
              formData={formData} 
              setFormData={setFormData} 
              error={error}
              setError={setError}
            />

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/enderecos" className="btn btn-light me-2">Cancelar</Link>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Endereço'}
              </Button>
            </div>

          </Form>
        </div>
      </div>
    </Container>
  );
};

export default EnderecoForm;