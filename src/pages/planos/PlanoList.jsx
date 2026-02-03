import { useEffect, useState } from 'react';
import { Container, Table, Card, Alert, Badge, Pagination } from 'react-bootstrap'; // Pagination adicionado
import ModalConfirmacao from '../../components/global/ModalConfirmacao';
import PageTitulo from '../../components/global/PageTitulo';
import BotaoCadastro from '../../components/global/BotaoCadastro';
import BotõesAcao from '../../components/global/BotoesAcao';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import PlanoService from '../../services/PlanoService';

const PlanoList = () => {
    useEffect(() => {
        document.title = "Planos - FitPay"; // Define o título da guia
    }, []);
    
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para Paginação
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Estados para o Modal de Exclusão
    const [showModal, setShowModal] = useState(false);
    const [planoToDelete, setPlanoToDelete] = useState(null);

    // Busca os dados assim que a tela carrega ou muda a página
    useEffect(() => {
        carregarPlanos(currentPage);
    }, [currentPage]); 

    // Atualizado para receber a página
    const carregarPlanos = async (page = 0) => {
        try {
            setLoading(true);
            const dados = await PlanoService.findAll(page, 10); 
            setPlanos(dados.content || []); 
            setTotalPages(dados.totalPages); // Atualiza total de páginas
            setError(null);
        } catch (err) {
            setError('Erro ao carregar planos. Verifique se o Backend está rodando.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAbrirConfirmacao = (id) => {
        setPlanoToDelete(id);
        setShowModal(true);
    };

    const confirmarExclusao = async () => {
        try {
            await PlanoService.delete(planoToDelete);
            // Recarrega na página atual
            carregarPlanos(currentPage);
            setShowModal(false); 
            setPlanoToDelete(null); 
            setError(null); 
        } catch (err) {
            setError('Não foi possível excluir o plano. Ele pode estar vinculado a uma matrícula.');
            setShowModal(false);
        }
    };

    // LÓGICA DE PAGINAÇÃO (Max 5 botões)
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
            
            {/* Cabeçalho da Página */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center mb-4 gap-3">
                <PageTitulo titulo="Planos" descricao="Gerencie os pacotes de matrícula da academia." />
                <BotaoCadastro para="/planos/novo" texto="Novo Plano" />
            </div>

            {/* Alerta de Erro (se houver) - PADRONIZADO (Dismissible) */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {/* Renderização Condicional: Carregando (Padronizado com Alunos/Endereços) */}
            {loading ? (
                <CarregandoSpinner mensagem="Buscando planos no sistema..." />
            ) : (
                /* Tabela de Dados */
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
                                    <EstadoVazio 
                                        icone="bi-inbox" 
                                        colSpan="5" 
                                        mensagemVazia="Nenhum plano cadastrado ainda."
                                    />
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
                                        
                                        {/* AÇÕES */}
                                        <td className="text-end pe-4">
                                            <BotõesAcao 
                                                id={plano.id}
                                                rotaEditar={`/planos/editar/${plano.id}`}
                                                onDelete={handleAbrirConfirmacao}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Componente de Paginação */}
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
                mensagem="Tem certeza que deseja excluir este plano? Esta ação não poderá ser desfeita."
            />
        </Container>
    );
};

export default PlanoList;