import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlanoService from '../../services/PlanoService';

const PlanoList = () => {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Busca os dados assim que a tela carrega
    useEffect(() => {
        carregarPlanos();
    }, []);

    const carregarPlanos = async () => {
        try {
        setLoading(true);
        // Chama o Service -> API Java -> Banco de Dados
        const dados = await PlanoService.findAll(); 
        // O Spring retorna um objeto Page, a lista real está em 'content'
        setPlanos(dados.content || []); 
        setError(null);
        } catch (err) {
           setError('Erro ao carregar planos. Verifique se o Backend está rodando.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este plano?')) {
            try {
                await PlanoService.delete(id);
                // Atualiza a lista removendo o item excluído visualmente
                setPlanos(planos.filter(p => p.id !== id));
            } catch (err) {
                alert('Erro ao excluir o plano.');
            }
        }
    };

    // Renderização Condicional: Carregando
    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Buscando dados no sistema...</p>
            </Container>
        );
    }

    return (
        <Container className="py-5">
        
            {/* Cabeçalho da Página */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-midnight">Planos</h2>
                    <p className="text-muted">Gerencie os pacotes de matrícula da academia.</p>
                </div>
                <Link to="/planos/novo">
                    <Button variant="primary" className="fw-bold shadow-sm">
                        <i className="bi bi-plus-lg me-2"></i>Novo Plano
                    </Button>
                </Link>
            </div>

            {/* Alerta de Erro (se houver) */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Tabela de Dados */}
            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light text-secondary">
                            <tr>
                                <th className="ps-4">Nome</th>
                                <th>Valor</th>
                                <th>Duração</th>
                                <th>Descrição</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planos.length === 0 ? (
                                <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                    Nenhum plano cadastrado ainda.
                                </td>
                                </tr>
                            ) : (
                            planos.map((plano) => (
                                <tr key={plano.id}>
                                    <td className="ps-4 fw-bold text-midnight">{plano.nome}</td>
                                    <td className="text-success fw-bold">
                                        {plano.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td>
                                        <Badge bg="light" text="dark" className="border">
                                            {plano.duracao_dias} dia(s)
                                        </Badge>
                                    </td>
                                    <td className="text-muted small">{plano.descricao || '-'}</td>
                                    <td className="text-end pe-4">
                                        <Link to={`/planos/editar/${plano.id}`}>
                                            <Button variant="link" className="text-primary p-0 me-3" title="Editar">
                                                <i className="bi bi-pencil-square fs-5"></i>
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="link" 
                                            className="text-danger p-0" 
                                            title="Excluir"
                                            onClick={() => handleDelete(plano.id)}
                                        >
                                            <i className="bi bi-trash fs-5"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PlanoList;