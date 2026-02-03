import { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Alert, Form, Pagination } from 'react-bootstrap';
import PageTitulo from '../../components/global/PageTitulo';
import BarraBusca from '../../components/global/BarraBusca';
import BotaoCadastro from '../../components/global/BotaoCadastro';
import BotoesAcao from '../../components/global/BotoesAcao';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import AlunoService from '../../services/AlunoService';
import ModalConfirmacao from '../../components/global/ModalConfirmacao';
import MatriculaModal from '../../components/matricula/MatriculaModal';
import HistoricoMatriculasModal from '../../components/matricula/HistoricoMatriculasModal';

const AlunoList = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filtro de Status
    const [statusFilter, setStatusFilter] = useState(''); 

    // Estados de Paginação
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [alunoToDelete, setAlunoToDelete] = useState(null);

    // Estados para Matrícula 
    const [showModalMatricula, setShowModalMatricula] = useState(false);
    const [alunoParaMatricula, setAlunoParaMatricula] = useState(null);

    // Estados para Histórico
    const [showModalHistorico, setShowModalHistorico] = useState(false);
    const [alunoParaHistorico, setAlunoParaHistorico] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarAlunos(currentPage, searchTerm, statusFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, currentPage]); 

    const carregarAlunos = async (page = 10, termo = '', status = '') => {
        try {
            setLoading(true);
            const dados = await AlunoService.findAll(page, 10
                , termo, status); 
            setAlunos(dados.content || []);
            setTotalPages(dados.totalPages);
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
            if (!alunoToDelete) return;
            await AlunoService.delete(alunoToDelete);
            carregarAlunos(currentPage, searchTerm, statusFilter);
            setShowModal(false); 
            setAlunoToDelete(null);
            setError(null); 
        } catch (err) {
            setError('Não foi possível excluir o aluno. Verifique se ele possui matrículas ativas.');
            setShowModal(false);
        }
    };

    // Função para abrir o Modal de Matrícula
    const handleAbrirMatricula = (aluno) => {
        setAlunoParaMatricula(aluno);
        setShowModalMatricula(true);
    };

    // Função para abrir o Modal de Histórico 
    const handleAbrirHistorico = (aluno) => {
        setAlunoParaHistorico(aluno);
        setShowModalHistorico(true);
    };

    // Lógica para Paginação com no máximo 5 botões visíveis
    const maxButtons = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 3);

    if (totalPages > maxButtons) {
        if (currentPage <= 2) {
            startPage = 0;
            endPage = maxButtons;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - maxButtons;
            endPage = totalPages;
        }
    } else {
        startPage = 0;
        endPage = totalPages;
    }

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
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                        style={{ minWidth: '150px' }}
                        className="shadow-sm"
                    >
                        <option value="">Todos</option>
                        <option value="ATIVO">Ativos</option>
                        <option value="INATIVO">Inativos</option>
                    </Form.Select>

                    {/* CAMPO DE BUSCA */}
                    <BarraBusca
                        placeholder="Pesquisar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                    />

                    {/* BOTÃO NOVO ALUNO */}
                    <BotaoCadastro para="/alunos/novo" texto="Novo Aluno" />
                </div>
            </div>

            {/* PADRONIZAÇÃO: Alert dismissible (fechável) */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {loading ? (
                <CarregandoSpinner mensagem="Carregando alunos..." />
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
                                    <EstadoVazio 
                                        icone="bi-people" 
                                        colSpan="6" 
                                        mensagemVazia="Nenhum aluno cadastrado."
                                        temFiltro={searchTerm || statusFilter}
                                    />
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
                                                        <span className="badge bg-success" style={{ fontSize: '0.7em' }}>ATIVO</span>
                                                    ) : (
                                                        <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>INATIVO</span>
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
                                                    <Button 
                                                        variant="link"
                                                        className="text-info p-0 border-0"
                                                        title="Ver Histórico"
                                                        onClick={() => handleAbrirHistorico(aluno)}
                                                    >
                                                        <i className="bi bi-clock-history fs-5"></i>
                                                    </Button>

                                                    <BotoesAcao 
                                                        id={aluno.id}
                                                        rotaEditar={`/alunos/editar/${aluno.id}`}
                                                        onDelete={handleAbrirConfirmacao}
                                                    />
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

            {/* Paginação com lógica de Max 5 botões */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.First 
                            onClick={() => setCurrentPage(0)} 
                            disabled={currentPage === 0} 
                        />
                        <Pagination.Prev 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
                            disabled={currentPage === 0} 
                        />
                        
                        {/* Renderiza apenas o intervalo calculado (startPage até endPage) */}
                        {[...Array(endPage - startPage)].map((_, i) => {
                            const pageIndex = startPage + i;
                            return (
                                <Pagination.Item 
                                    key={pageIndex} 
                                    active={pageIndex === currentPage}
                                    onClick={() => setCurrentPage(pageIndex)}
                                >
                                    {pageIndex + 1}
                                </Pagination.Item>
                            );
                        })}
                        
                        <Pagination.Next 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} 
                            disabled={currentPage === totalPages - 1} 
                        />
                        <Pagination.Last 
                            onClick={() => setCurrentPage(totalPages - 1)} 
                            disabled={currentPage === totalPages - 1} 
                        />
                    </Pagination>
                </div>
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