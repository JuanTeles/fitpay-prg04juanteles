import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ModalConfirmacao from '../../components/ModalConfirmacao';
import MatriculaModal from '../../components/MatriculaModal'; 
// Import do novo modal de histórico
import HistoricoMatriculasModal from '../../components/HistoricoMatriculasModal';
import PageTitulo from '../../components/global/PageTitulo';
import AlunoService from '../../services/AlunoService';

const AlunoList = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filtro de Status
    const [statusFilter, setStatusFilter] = useState(''); 

    const [showModal, setShowModal] = useState(false);
    const [alunoToDelete, setAlunoToDelete] = useState(null);

    // Estados para Matrícula 
    const [showModalMatricula, setShowModalMatricula] = useState(false);
    const [alunoParaMatricula, setAlunoParaMatricula] = useState(null);

    // Estados para Histórico (NOVO)
    const [showModalHistorico, setShowModalHistorico] = useState(false);
    const [alunoParaHistorico, setAlunoParaHistorico] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarAlunos(searchTerm, statusFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter]); 

    const carregarAlunos = async (termo = '', status = '') => {
        try {
            setLoading(true);
            // Chama o service enviando paginação, termo de busca E status
            const dados = await AlunoService.findAll(0, 10, termo, status); 
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

    // Função para abrir o Modal de Matrícula
    const handleAbrirMatricula = (aluno) => {
        setAlunoParaMatricula(aluno);
        setShowModalMatricula(true);
    };

    // Função para abrir o Modal de Histórico (NOVO)
    const handleAbrirHistorico = (aluno) => {
        setAlunoParaHistorico(aluno);
        setShowModalHistorico(true);
    };

    return (
        <Container className="py-5">
            {/* Cabeçalho Responsivo */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">
                
                {/* LADO ESQUERDO: Título */}
                <PageTitulo titulo="Alunos" descricao="Gestão de alunos" />

                {/* LADO DIREITO: Filtros + Botão */}
                <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center w-100 w-lg-auto">
                    
                    {/* FILTRO */}
                    <Form.Select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ minWidth: '150px' }}
                        className="shadow-sm"
                    >
                        <option value="">Todos</option>
                        <option value="ATIVO">Ativos</option>
                        <option value="INATIVO">Inativos</option>
                    </Form.Select>

                    {/* CAMPO DE BUSCA */}
                    <Form.Control
                        type="text"
                        placeholder="Pesquisar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ minWidth: '280px' }} 
                    />

                    {/* BOTÃO NOVO ALUNO */}
                    <Link to="/alunos/novo" className="d-block d-md-inline-block">
                        <Button variant="primary" className="fw-bold text-nowrap shadow-sm w-100 w-md-auto">
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
                                    <th>Realizar Matricula</th>
                                    <th className="text-end pe-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alunos.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <i className="bi bi-people fs-1 d-block mb-2"></i>
                                            {searchTerm || statusFilter ? 'Nenhum resultado encontrado.' : 'Nenhum aluno cadastrado.'}
                                        </td>
                                    </tr>
                                ) : (
                                    alunos.map((aluno) => (
                                        <tr key={aluno.id}>
                                            <td className="ps-4 fw-bold">
                                                {/* Container Flex para alinhar Nome e Badge */}
                                                <div className="d-flex align-items-center flex-wrap gap-2">
                                                    
                                                    {/* Primeiro Nome */}
                                                    <span>{aluno.nome ? aluno.nome.split(' ')[0] : ''}</span>
                                                    
                                                    {/* Badge de Status */}
                                                    {aluno.ativo ? (
                                                        <span className="badge bg-success" style={{ fontSize: '0.7em' }}>
                                                            ATIVO
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
                                                            INATIVO
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-nowrap">{aluno.cpf}</td>
                                            <td>{aluno.email}</td>
                                            <td className="text-nowrap">{aluno.telefone || '-'}</td>
                                            
                                            <td className='text-center'>
                                                {/* Botão de Matrícula */}
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 me-3 text-success text-nowrap"
                                                    title="Realizar Matrícula"
                                                    onClick={() => handleAbrirMatricula(aluno)}
                                                >
                                                    <i className="bi bi-card-checklist fs-5"></i>
                                                </Button>
                                            </td>
                                            
                                            {/* AÇÕES */}
                                            <td className="text-end pe-4">
                                            <div className="d-flex align-items-center justify-content-end gap-3">
                                                
                                                {/* Botão Histórico */}
                                                <Button 
                                                    variant="link"
                                                    className="text-info p-0 border-0"
                                                    title="Ver Histórico"
                                                    onClick={() => handleAbrirHistorico(aluno)}
                                                >
                                                    <i className="bi bi-clock-history fs-5"></i>
                                                </Button>

                                                {/* Botão Editar */}
                                                <Link to={`/alunos/editar/${aluno.id}`} className="text-primary" title="Editar">
                                                    <i className="bi bi-pencil-square fs-5"></i>
                                                </Link>

                                                {/* Botão Excluir */}
                                                <Button 
                                                    variant="link"
                                                    className="text-danger p-0 border-0"
                                                    title="Excluir"
                                                    onClick={() => handleAbrirConfirmacao(aluno.id)}
                                                >
                                                    <i className="bi bi-trash fs-5"></i>
                                                </Button>
                                            </div>
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

            {/* Modal de Matrícula */}
            <MatriculaModal 
                show={showModalMatricula}
                handleClose={() => setShowModalMatricula(false)}
                aluno={alunoParaMatricula}
            />

            {/* Modal de Histórico */}
            <HistoricoMatriculasModal 
                show={showModalHistorico}
                handleClose={() => setShowModalHistorico(false)}
                aluno={alunoParaHistorico}
            />
        </Container>
    );
};

export default AlunoList;