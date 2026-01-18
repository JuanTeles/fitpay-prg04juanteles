//
import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ModalConfirmacao from '../../components/ModalConfirmacao';
import AlunoService from '../../services/AlunoService';

const AlunoList = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [alunoToDelete, setAlunoToDelete] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarAlunos(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const carregarAlunos = async (termo = '') => {
        try {
            setLoading(true);
            const dados = await AlunoService.findAll(0, 10, termo); 
            setAlunos(dados.content || []);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar lista de alunos.');
        } finally {
            setLoading(false);
        }
    };

    const handleAbrirConfirmacao = (id) => {
        setAlunoToDelete(id);
        setShowModal(true);
    };

    const confirmarExclusao = async () => {
        try {
            await AlunoService.delete(alunoToDelete);
            setAlunos(alunos.filter(a => a.id !== alunoToDelete));
            setShowModal(false); 
        } catch (err) {
            alert('Erro ao excluir aluno.');
            setShowModal(false);
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                
                {/* LADO ESQUERDO: Títulos */}
                <div>
                    <h2 className="fw-bold text-midnight">Alunos</h2>
                    <p className="text-muted mb-0">Gestão de alunos</p>
                </div>

                {/* LADO DIREITO: Busca + Botão (Alinhados na horizontal) */}
                <div className="d-flex gap-2 align-items-center">
                    
                    {/* CAMPO DE BUSCA */}
                    <Form.Control
                        type="text"
                        placeholder="Pesquisar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '280px' }} // Largura fixa para não quebrar layout
                    />

                    {/* BOTÃO NOVO ALUNO */}
                    <Link to="/alunos/novo">
                        <Button variant="primary" className="fw-bold text-nowrap shadow-sm">
                            <i className="bi bi-plus-lg me-1"></i>
                            Novo Aluno
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ALERTA DE ERRO */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* TABELA */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-0">
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light text-secondary">
                                <tr>
                                    <th className="ps-4">Nome</th>
                                    <th>CPF</th>
                                    <th>Email</th>
                                    <th>Telefone</th>
                                    <th className="text-end pe-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alunos.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <i className="bi bi-people fs-1 d-block mb-2"></i>
                                            {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum aluno cadastrado.'}
                                        </td>
                                    </tr>
                                ) : (
                                    alunos.map((aluno) => (
                                        <tr key={aluno.id}>
                                            <td className="ps-4 fw-bold">{aluno.nome}</td>
                                            <td>{aluno.cpf}</td>
                                            <td>{aluno.email}</td>
                                            <td>{aluno.telefone || '-'}</td>
                                            <td className="text-end pe-4">
                                                <Link to={`/alunos/editar/${aluno.id}`} className="me-3">
                                                    <i className="bi bi-pencil-square fs-5 text-primary"></i>
                                                </Link>
                                                <span 
                                                    style={{ cursor: 'pointer' }} 
                                                    onClick={() => handleAbrirConfirmacao(aluno.id)}
                                                >
                                                    <i className="bi bi-trash fs-5 text-danger"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            <ModalConfirmacao
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={confirmarExclusao}
                titulo="Confirmar Exclusão"
                mensagem="Deseja realmente excluir este aluno?"
            />
        </Container>
    );
};

export default AlunoList;