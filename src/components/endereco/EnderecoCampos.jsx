import React from 'react';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

const EnderecoCampos = ({ formData, setFormData, error, setError }) => {
  const [cepLoading, setCepLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setCepLoading(true);
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            uf: response.data.uf,
            cep: cep
          }));
          setError(null);
        } else {
          setError('CEP não encontrado.');
        }
      } catch (err) {
        setError('Erro ao consultar ViaCEP.');
      } finally {
        setCepLoading(false);
      }
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group controlId="cep">
            <Form.Label>CEP <span className="text-danger">*</span></Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                name="cep"
                value={formData.cep || ''}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength="9"
                required
              />
              {cepLoading && (
                <span className="input-group-text bg-white">
                  <Spinner animation="border" size="sm" />
                </span>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="uf">
            <Form.Label>UF *</Form.Label>
            <Form.Control type="text" name="uf" value={formData.uf || ''} onChange={handleChange} maxLength="2" required />
          </Form.Group>
        </Col>
        <Col md={7}>
          <Form.Group controlId="cidade">
            <Form.Label>Cidade *</Form.Label>
            <Form.Control type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={9}>
          <Form.Group controlId="logradouro">
            <Form.Label>Logradouro *</Form.Label>
            <Form.Control type="text" name="logradouro" value={formData.logradouro || ''} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="numero">
            <Form.Label>Número *</Form.Label>
            <Form.Control type="text" name="numero" value={formData.numero || ''} onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={5}>
          <Form.Group controlId="bairro">
            <Form.Label>Bairro *</Form.Label>
            <Form.Control type="text" name="bairro" value={formData.bairro || ''} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={7}>
          <Form.Group controlId="complemento">
            <Form.Label>Complemento</Form.Label>
            <Form.Control type="text" name="complemento" value={formData.complemento || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default EnderecoCampos;