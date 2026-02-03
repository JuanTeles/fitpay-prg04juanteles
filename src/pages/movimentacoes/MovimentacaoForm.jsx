import { useState, useEffect } from 'react'; 
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; 
import MovimentacaoService from '../../services/MovimentacaoService';
import PageTitulo from '../../components/global/PageTitulo';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';

const MovimentacaoForm = () => {
    useEffect(() => {
        document.title = "Formulário Movimentação Financeira - FitPay"; // Define o título da guia
    }, []);

    const navigate = useNavigate();
    const { id } = useParams(); // Pega o ID da URL (se for edição)
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const [formData, setFormData] = useState({
        descricao: '',
        valor: '',
        tipo_movimentacao: 'SAIDA',
        categoria_movimentacao: 'ALUGUEL',
        data_hora: '' 
    });

    // Carrega os dados se for edição
    useEffect(() => {
        if (id) {
            carregarDados(id);
        }
    }, [id]);

    const carregarDados = async (idMov) => {
        try {
            setLoading(true);
            const dados = await MovimentacaoService.findById(idMov);
            
            // Formata a data para o input datetime-local
            let dataFormatada = '';
            if(dados.data_hora) {
                dataFormatada = dados.data_hora.substring(0, 16);
            }

            setFormData({
                descricao: dados.descricao,
                valor: dados.valor,
                tipo_movimentacao: dados.tipo_movimentacao,
                categoria_movimentacao: dados.categoria_movimentacao,
                data_hora: dataFormatada
            });
        } catch (error) {
            setErro('Erro ao carregar dados para edição.');
        } finally {
            setLoading(false);
        }
    };

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
                // Adiciona segundos ":00" se data preenchida
                data_hora: formData.data_hora ? formData.data_hora + ':00' : null 
            };

            // Lógica de Decisão: Edição ou Criação
            if (id) {
                payload.id = parseInt(id);
                await MovimentacaoService.update(payload);
            } else {
                await MovimentacaoService.save(payload);
            }

            // SUCESSO: Redireciona imediatamente (Padrão sem alert)
            navigate('/movimentacoes'); 
        } catch (error) {
            console.error(error);
            setErro('Erro ao salvar movimentação. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.descricao) return <CarregandoSpinner />;

    return (
        <Container className="py-4">
            <PageTitulo 
                titulo={id ? "Editar Movimentação" : "Nova Movimentação"} 
                subtitulo={id ? "Alterar dados do lançamento" : "Lançamento manual de receitas ou despesas"} 
            />

            <Card className="shadow-sm">
                <Card.Body>
                    {/* PADRONIZAÇÃO: Alert agora é 'dismissible' (fechável) */}
                    {erro && (
                        <Alert variant="danger" onClose={() => setErro('')} dismissible>
                            {erro}
                        </Alert>
                    )}

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
                                    <Form.Label>Data (Opcional na criação)</Form.Label>
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
                                        <option value="ENTRADA">Entrada (Receita)</option>
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
                                {id ? 'Salvar Alterações' : 'Salvar Movimentação'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MovimentacaoForm;