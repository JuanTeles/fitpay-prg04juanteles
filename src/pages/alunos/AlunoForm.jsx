import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AlunoService from '../../services/AlunoService';
import EnderecoCampos from '../../components/endereco/EnderecoCampos'; 

const AlunoForm = () => {
    useEffect(() => {
        document.title = "Formulário Aluno - FitPay"; // Define o título da guia
    }, []);

    const navigate = useNavigate();
    const { id } = useParams();

    // Dados do Aluno
    const [aluno, setAluno] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        dataMatricula: '' 
    });

    // Dados do Endereço
    const [endereco, setEndereco] = useState({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    });

    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) carregarAluno(id);
    }, [id]);

    const carregarAluno = async (alunoId) => {
        try {
            const dados = await AlunoService.findById(alunoId);
            setAluno({
                nome: dados.nome,
                cpf: dados.cpf,
                email: dados.email,
                telefone: dados.telefone,
                dataMatricula: dados.data_matricula || ''
            });
            
            if (dados.endereco) {
                setEndereco(dados.endereco);
            }
        } catch (err) {
            setError('Erro ao carregar dados do aluno.');
        }
    };

    // Validação de CPF
    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '') return false;
        // Elimina CPFs invalidos conhecidos
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // Validação Front-end do CPF
        if (!validarCPF(aluno.cpf)) {
            setError('CPF inválido. Verifique os números digitados.');
            setSaving(false);
            return;
        }

        try {
            // Monta o objeto final como o Java espera (Aluno + Endereco aninhado)
            const dataFormatada = aluno.dataMatricula === '' ? null : aluno.dataMatricula;

            const payload = {
                nome: aluno.nome,
                cpf: aluno.cpf,
                email: aluno.email,
                telefone: aluno.telefone,
                data_matricula: dataFormatada,
                endereco: { ...endereco }
            };

            if (id) {
                payload.id = parseInt(id);
                await AlunoService.update(payload);
            } else {
                await AlunoService.save(payload);
            }
            navigate('/alunos');
        } catch (err) {
            const msg = err.response?.data?.message || 'Erro ao salvar aluno.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAluno({ ...aluno, [name]: value });
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <h3 className="fw-bold text-midnight mb-4">{id ? 'Editar Aluno' : 'Novo Aluno'}</h3>
                            
                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <h5 className="text-secondary mb-3 border-bottom pb-2">Dados Pessoais</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nome Completo *</Form.Label>
                                            <Form.Control type="text" name="nome" value={aluno.nome} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CPF *</Form.Label>
                                            <Form.Control type="text" name="cpf" value={aluno.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control type="email" name="email" value={aluno.email} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Telefone *</Form.Label>
                                            <Form.Control type="text" name="telefone" value={aluno.telefone} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h5 className="text-secondary mt-4 mb-3 border-bottom pb-2">Endereço</h5>
                                <EnderecoCampos 
                                    formData={endereco} 
                                    setFormData={setEndereco} 
                                    error={error} 
                                    setError={setError} 
                                />

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Link to="/alunos" className="btn btn-outline-secondary">Cancelar</Link>
                                    <Button variant="primary" type="submit" disabled={saving}>
                                        {saving ? 'Salvando...' : 'Salvar Aluno'}
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

export default AlunoForm;