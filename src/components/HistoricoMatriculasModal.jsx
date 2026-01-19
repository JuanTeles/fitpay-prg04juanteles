import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner, Badge, Alert } from 'react-bootstrap';
import MatriculaService from '../services/MatriculaService';

const HistoricoMatriculasModal = ({ show, handleClose, aluno }) => {
    const [matriculas, setMatriculas] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Carrega o histórico de Planos
        const carregarDados = async () => {
            try {
                setLoading(true);
                setError(null);

                const dadosMatriculas = await MatriculaService.findByAluno(aluno.id);

                setMatriculas(dadosMatriculas);

            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        };

        if (show && aluno) {
            carregarDados();
        } else {
            setMatriculas([]);
        }
    }, [show, aluno]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'ATIVO': return 'success';
            case 'PENDENTE': return 'warning';
            case 'CANCELADO': return 'danger';
            case 'EXPIRADO': return 'secondary';
            default: return 'primary';
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-midnight">
                    Histórico de: <span className="fw-bold">{aluno?.nome}</span>
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Carregando histórico...</p>
                    </div>
                ) : (
                    <>
                        {matriculas.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-folder-x fs-1 mb-2 d-block"></i>
                                Nenhuma matrícula encontrada para este aluno.
                            </div>
                        ) : (
                            <Table hover responsive striped className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Plano</th>
                                        <th>Início</th>
                                        <th>Fim</th>
                                        <th>Valor</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matriculas.map((mat) => {
                                        // Detalhes do plano são acessados diretamente do objeto 'mat.plano'
                                        const nomePlano = mat.plano ? mat.plano.nome : 'Plano Removido/Não Encontrado';
                                        const valorPlano = mat.plano ? mat.plano.valor : null;
                                        
                                        return (
                                            <tr key={mat.id}>
                                                <td className="fw-bold">
                                                    {nomePlano}
                                                </td>
                                                <td>{new Date(mat.data_inicio).toLocaleDateString('pt-BR')}</td>
                                                <td>{new Date(mat.data_fim).toLocaleDateString('pt-BR')}</td>
                                                <td>
                                                    {valorPlano 
                                                        ? `R$ ${valorPlano.toFixed(2)}` 
                                                        : '-'
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg={getStatusVariant(mat.status)}>
                                                        {mat.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HistoricoMatriculasModal;