import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MovimentacaoService from '../../services/MovimentacaoService';
import PageTitulo from '../../components/global/PageTitulo';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';

const MovimentacaoForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const [formData, setFormData] = useState({
        descricao: '',
        valor: '',
        tipo_movimentacao: 'SAIDA', // Padrão SAIDA para despesas
        categoria_movimentacao: 'ALUGUEL', // Padrão
        data_hora: '' // Se vazio, backend assume agora
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            // Converter valor para número float
            const payload = {
                ...formData,
                valor: parseFloat(formData.valor),
                // Se a data estiver vazia, removemos para o backend usar LocalDateTime.now()
                // Adiciona segundos ":00" se data preenchida para compatibilidade datetime-local
                data_hora: formData.data_hora ? formData.data_hora + ':00' : null 
            };

            await MovimentacaoService.save(payload);
            navigate('/movimentacoes'); // Volta para a lista
        } catch (error) {
            setErro('Erro ao salvar movimentação. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    // Spinner de carregamento
    if (loading) return <CarregandoSpinner />;

    return (
        <Container className="py-4">
            <PageTitulo titulo="Nova Movimentação" subtitulo="Lançamento manual de receitas ou despesas" />

            <Card className="shadow-sm">
                <Card.Body>
                    {/* Exibe erro caso ocorra */}
                    {erro && <Alert variant="danger">{erro}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        placeholder="Ex: Pagamento conta de luz"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Valor (R$)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        step="0.01"
                                        name="valor"
                                        value={formData.valor}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Data (Opcional)</Form.Label>
                                    <Form.Control 
                                        type="datetime-local" 
                                        name="data_hora"
                                        value={formData.data_hora}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select 
                                        name="tipo_movimentacao" 
                                        value={formData.tipo_movimentacao}
                                        onChange={handleChange}
                                    >
                                        <option value="SAIDA">Saída (Despesa)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Select 
                                        name="categoria_movimentacao" 
                                        value={formData.categoria_movimentacao}
                                        onChange={handleChange}
                                    >
                                        <option value="ALUGUEL">Aluguel</option>
                                        <option value="SALARIO">Salário</option>
                                        <option value="COMPRA_MATERIAL">Compra de Material</option>
                                        <option value="CONTA_LUZ">Conta de Luz</option>
                                        <option value="CONTA_AGUA">Conta de Água</option>
                                        <option value="INTERNET">Internet</option>
                                        <option value="MANUTENCAO">Manutenção</option>
                                        <option value="OUTROS">Outros</option>
                                        {/* MENSALIDADE gerada automaticamente */}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Botões de ação */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => navigate('/movimentacoes')}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Salvar Movimentação
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MovimentacaoForm;