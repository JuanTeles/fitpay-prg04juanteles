import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PagamentoService from '../../services/PagamentoService';
import MatriculaService from '../../services/MatriculaService'; // Importante para selecionar o contrato

const PagamentoForm = () => {
  const navigate = useNavigate();
  const [matriculas, setMatriculas] = useState([]);
  
  const [formData, setFormData] = useState({
    valor_pago: '',
    referencia_periodo: '', // ex: "Fevereiro/2026"
    metodo_pagamento: 'PIX',
    contrato_id: ''
  });

  useEffect(() => {
    // Carrega as matrículas para o select
    const loadMatriculas = async () => {
      try {
        // Assume que o findAll retorna um Page, pegamos o content
        const data = await MatriculaService.findAll(0, 100); 
        setMatriculas(data.content || []);
      } catch (error) {
        console.error("Erro ao carregar matrículas", error);
      }
    };
    loadMatriculas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Monta o JSON conforme o DTO do Backend (PagamentoPostRequestDto)
    const payload = {
      valor_pago: parseFloat(formData.valor_pago),
      referencia_periodo: formData.referencia_periodo,
      metodo_pagamento: formData.metodo_pagamento,
      // O backend espera um objeto aninhado: "contrato_aluno": { "id": 1 }
      contrato_aluno: {
        id: parseInt(formData.contrato_id)
      }
    };

    try {
      await PagamentoService.create(payload);
      alert('Pagamento registrado com sucesso!');
      navigate('/financeiro');
    } catch (error) {
      alert('Erro ao salvar pagamento. Verifique os dados.');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
          <h4 className="fw-bold text-midnight">Registrar Pagamento</h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Contrato / Aluno</Form.Label>
                  <Form.Select 
                    name="contrato_id" 
                    value={formData.contrato_id} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o contrato...</option>
                    {matriculas.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        #{mat.id} - {mat.aluno?.nome || "Aluno ID " + mat.aluno_id}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Referência (Mês/Ano)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="referencia_periodo"
                    placeholder="Ex: Janeiro/2026"
                    value={formData.referencia_periodo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Valor Pago (R$)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01"
                    name="valor_pago"
                    value={formData.valor_pago}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Método</Form.Label>
                  <Form.Select 
                    name="metodo_pagamento" 
                    value={formData.metodo_pagamento} 
                    onChange={handleChange}
                  >
                    <option value="PIX">PIX</option>
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                    <option value="CARTAO_DEBITO">Cartão de Débito</option>
                    <option value="BOLETO">Boleto</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/financeiro')}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Pagamento
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PagamentoForm;