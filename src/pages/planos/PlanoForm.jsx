import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PlanoService from '../../services/PlanoService';

const PlanoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Identifica se é Edição (tem ID) ou Cadastro (não tem)
    
    // Estado inicial do objeto Plano
    const [plano, setPlano] = useState({
        nome: '',
        valor: '',
        duracaoDias: '',
        descricao: ''
    });

    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // Se tiver ID na URL, busca os dados do plano para editar
    useEffect(() => {
        if (id) {
            carregarPlano(id);
        }
    }, [id]);

    const carregarPlano = async (planoId) => {
    try {
        setLoadingData(true);
        const dados = await PlanoService.findById(planoId);
        
        // Preenche o formulário com os dados que viram da API
        setPlano({
            nome: dados.nome,
            valor: dados.valor,
            duracaoDias: dados.duracao_dias || dados.duracaoDias, 
            descricao: dados.descricao || ''
        });
      
    } catch (err) {
        setError('Erro ao carregar dados para edição.');
        console.error(err);
    } finally {
          setLoadingData(false);
    }
  };

    // Envia os dados para o Backend
    const handleSubmit = async (e) => {
        e.preventDefault(); // Não recarrega a página
        setSaving(true);
        setError(null);

    try {
        // Substitui vírgula por ponto para evitar erro de Locale
        let valorFormatado = plano.valor.toString().replace(',', '.');
        // Prepara o objeto convertendo números
        const payload = {
            nome: plano.nome,
            valor: parseFloat(valorFormatado), 
            duracao_dias: parseInt(plano.duracaoDias),
            descricao: plano.descricao || '' // Envia string vazia se for null
        };

        // SÓ adiciona o ID no objeto se ele realmente existir (Edição).
        // Se for cadastro (id null/undefined), NÃO enviamos o campo "id" pro Java.
        if (id) {
            payload.id = parseInt(id);
            await PlanoService.update(payload);
        } else {
            await PlanoService.save(payload); 
        }

        // Volta para a lista
        navigate('/planos');

    } catch (err) {
        console.error("Erro detalhado:", err);
        
        // CAPTURA INTELIGENTE DE ERRO
        // Tenta pegar a mensagem específica que o Spring mandou (Validation)
        let msg = 'Erro ao salvar o plano.';
        
        if (err.response) {
            // Se o Backend respondeu (ex: 400, 500)
            if (err.response.data && err.response.data.message) {
                msg = err.response.data.message; // Mensagem geral
            } 
            // Se for erro de validação de campos (ValidationErrors)
            else if (err.response.data && Array.isArray(err.response.data.errors)) {
                msg = err.response.data.errors.map(e => `${e.field}: ${e.defaultMessage}`).join(', ');
            }
        } 
        setError(msg);
        setSaving(false);
    }
  };

  // Atualiza o estado enquanto o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlano({ ...plano, [name]: value });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              
              {/* Cabeçalho do Card */}
              <div className="mb-4">
                <h3 className="fw-bold text-midnight">
                  {id ? 'Editar Plano' : 'Novo Plano'}
                </h3>
                <p className="text-muted small">Preencha as informações do pacote de matrícula.</p>
              </div>

              {/* Mensagem de Erro */}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* Formulário */}
              <Form onSubmit={handleSubmit}>
                
                {/* Campo: Nome */}
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Plano <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    name="nome"
                    value={plano.nome}
                    onChange={handleChange}
                    placeholder="Ex: Plano Gold, Mensal, Anual..." 
                    required 
                    autoFocus
                  />
                </Form.Group>

                <Row>
                  {/* Campo: Valor */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Valor (R$) <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="number" 
                        step="0.01"
                        name="valor"
                        value={plano.valor}
                        onChange={handleChange}
                        placeholder="0.00" 
                        required 
                      />
                    </Form.Group>
                  </Col>

                  {/* Campo: Duração */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duração (Dias) <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="number" 
                        name="duracaoDias"
                        value={plano.duracaoDias}
                        onChange={handleChange}
                        placeholder="Ex: 30" 
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Campo: Descrição */}
                <Form.Group className="mb-4">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="descricao"
                    value={plano.descricao}
                    onChange={handleChange}
                    placeholder="Detalhes adicionais sobre o plano..."
                  />
                </Form.Group>

                {/* Botões de Ação */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/planos" className="btn btn-outline-secondary me-2">
                    Cancelar
                  </Link>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Plano'}
                  </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlanoForm;