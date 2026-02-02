import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner, Badge, Alert } from 'react-bootstrap';
import MatriculaService from '../services/MatriculaService';
import ModalConfirmacao from './ModalConfirmacao';

const HistoricoMatriculasModal = ({ show, handleClose, aluno }) => {
    const [matriculas, setMatriculas] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para o controle do Modal e Recarga
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [matriculaSelecionada, setMatriculaSelecionada] = useState(null);
    const [recarregar, setRecarregar] = useState(false); // Gatilho para atualizar a lista
    
    // Estado para controlar qual ação será executada (TRANCAR ou DESTRANCAR)
    const [acao, setAcao] = useState(''); 

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
    }, [show, aluno, recarregar]);

    
    const handleStatusClick = (matricula, novaAcao) => {
        setMatriculaSelecionada(matricula);
        setAcao(novaAcao); // Define se vai TRANCAR ou DESTRANCAR
        setShowConfirmModal(true);
    };

    // Função que efetiva a ação
    const confirmarAlteracaoStatus = async () => {
        if (!matriculaSelecionada) return;

        try {
            setShowConfirmModal(false);
            setLoading(true);

            // Define o novo status baseado na ação escolhida
            const novoStatus = acao === 'TRANCAR' ? 'TRANCADO' : 'ATIVO';

            const payload = {
                ...matriculaSelecionada,
                status: novoStatus,
                // Garante que aluno e plano sejam enviados corretamente (ID ou Objeto)
                aluno: { id: matriculaSelecionada.aluno.id || matriculaSelecionada.aluno },
                plano: { id: matriculaSelecionada.plano.id || matriculaSelecionada.plano }
            };

            await MatriculaService.update(payload);
            
            // Força o useEffect a rodar novamente
            setRecarregar(!recarregar);

        } catch (err) {
            console.error(err);
            alert("Erro ao alterar status: " + (err.response?.data?.message || err.message));
            setLoading(false);
        } finally {
            setMatriculaSelecionada(null);
            setAcao('');
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'ATIVO': return 'success';
            case 'TRANCADO': return 'warning';
            case 'EXPIRADO': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <>
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
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matriculas.map((mat) => {
                                            // Detalhes do plano são acessados diretamente do objeto 'mat.plano'
                                            const nomePlano = mat.plano ? mat.plano.nome : 'Plano Removido/Não Encontrado';
                                            const valorMatricula = mat.valor_fechado;
                                            
                                            return (
                                                <tr key={mat.id}>
                                                    <td className="fw-bold">
                                                        {nomePlano}
                                                    </td>
                                                    <td>{new Date(mat.data_inicio).toLocaleDateString('pt-BR')}</td>
                                                    <td>{new Date(mat.data_fim).toLocaleDateString('pt-BR')}</td>
                                                    <td>
                                                        {valorMatricula
                                                            ? `R$ ${valorMatricula.toFixed(2)}` 
                                                            : '-'
                                                        }
                                                    </td>
                                                    <td className="text-center">
                                                        <Badge bg={getStatusVariant(mat.status)}>
                                                            {mat.status}
                                                        </Badge>
                                                    </td>
                                                    
                                                    {/* Botões de Ação Dinâmicos */}
                                                    <td className="text-center">
                                                        {mat.status === 'ATIVO' && (
                                                            <Button 
                                                                variant="warning" 
                                                                size="sm"
                                                                onClick={() => handleStatusClick(mat, 'TRANCAR')}
                                                                title="Trancar Matrícula"
                                                            >
                                                                <i className="bi bi-lock-fill me-1"></i>
                                                                Trancar
                                                            </Button>
                                                        )}

                                                        {mat.status === 'TRANCADO' && (
                                                            <Button 
                                                                variant="success" 
                                                                size="sm"
                                                                onClick={() => handleStatusClick(mat, 'DESTRANCAR')}
                                                                title="Destrancar Matrícula"
                                                            >
                                                                <i className="bi bi-unlock-fill me-1"></i>
                                                                Destrancar
                                                            </Button>
                                                        )}
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

            {/* Modal de Confirmação Dinâmico */}
            <ModalConfirmacao
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={confirmarAlteracaoStatus}
                titulo={acao === 'TRANCAR' ? "Confirmar Trancamento" : "Confirmar Destrancamento"}
                mensagem={`Deseja realmente ${acao === 'TRANCAR' ? 'trancar' : 'destrancar'} a matrícula do plano "${matriculaSelecionada?.plano?.nome}"?`}
                variant={acao === 'TRANCAR' ? "warning" : "success"}
                textoBotaoConfirmar={acao === 'TRANCAR' ? "Sim, Trancar" : "Sim, Destrancar"}
            />
        </>
    );
};

export default HistoricoMatriculasModal;