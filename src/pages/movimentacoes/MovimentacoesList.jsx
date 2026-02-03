import { useEffect, useState } from 'react';
import { Container, Table, Badge, Form, Alert, Pagination } from 'react-bootstrap'; // Adicionado Pagination
import MovimentacaoService from '../../services/MovimentacaoService';
import PageTitulo from '../../components/global/PageTitulo';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import EstadoVazio from '../../components/global/EstadoVazio';
import BotaoCadastro from '../../components/global/BotaoCadastro';
import BotoesAcao from '../../components/global/BotoesAcao'; 
import ModalConfirmacao from '../../components/ModalConfirmacao';

const MovimentacaoList = () => {
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(''); 

    // Estados para os filtros
    const [tipoFilter, setTipoFilter] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');

    // Estados para Paginação
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Estados para exclusão
    const [showModal, setShowModal] = useState(false);
    const [movToDelete, setMovToDelete] = useState(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchData(currentPage, tipoFilter, categoriaFilter);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [tipoFilter, categoriaFilter, currentPage]); 

    // Função para buscar movimentações
    const fetchData = async (page = 0, tipo = '', categoria = '') => {
        try {
            setLoading(true);
            const data = await MovimentacaoService.findAll(page, 10, tipo, categoria);
            
            // Ordenar do mais recente para o mais antigo 
            const ordenadas = (data.content || []).sort(
                (a, b) => new Date(b.data_hora) - new Date(a.data_hora)
            );
            
            setMovimentacoes(ordenadas);
            setTotalPages(data.totalPages); // Atualiza total de páginas
        } catch (error) {
            console.error("Erro ao carregar movimentações");
            setErro('Não foi possível carregar a lista de movimentações.');
        } finally {
            setLoading(false);
        }
    };

    // Abre modal de confirmação
    const handleAbrirConfirmacao = (id) => {
        setMovToDelete(id);
        setShowModal(true);
    };

    // Confirma exclusão
    const confirmarExclusao = async () => {
        try {
            if (!movToDelete) return;
            await MovimentacaoService.delete(movToDelete); 
            
            // Recarrega a lista mantendo a página atual
            fetchData(currentPage, tipoFilter, categoriaFilter);
            
            setShowModal(false);
            setMovToDelete(null);
            setErro(''); 
        } catch (err) {
            console.error("Erro ao excluir movimentação");
            setErro('Erro ao excluir a movimentação. Tente novamente.'); 
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

    if (loading) return <CarregandoSpinner />;

    return (
        <Container className="py-4">
            {/* Cabeçalho com Título, Filtros e Botão */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">
                <PageTitulo 
                    titulo="Fluxo de Caixa" 
                    descricao="Histórico de entradas e saídas financeiras" 
                />

                <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center w-100 w-lg-auto">
                    {/* Filtro de Tipo */}
                    <Form.Select 
                        value={tipoFilter}
                        onChange={(e) => {
                            setTipoFilter(e.target.value);
                            setCurrentPage(0); // Reseta página ao filtrar
                        }}
                        className="shadow-sm"
                        style={{ minWidth: '150px' }}
                    >
                        <option value="">Todos os Tipos</option>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SAIDA">Saída</option>
                    </Form.Select>

                    {/* Filtro de Categoria */}
                    <Form.Select 
                        value={categoriaFilter}
                        onChange={(e) => {
                            setCategoriaFilter(e.target.value);
                            setCurrentPage(0); // Reseta página ao filtrar
                        }}
                        className="shadow-sm"
                        style={{ minWidth: '180px' }}
                    >
                        <option value="">Todas Categorias</option>
                        <option value="MENSALIDADE">Mensalidade</option>
                        <option value="SALARIO">Salário</option>
                        <option value="COMPRA_MATERIAL">Compra de Material</option>
                        <option value="ALUGUEL">Aluguel</option>
                        <option value="CONTA_LUZ">Conta de Luz</option>
                        <option value="CONTA_AGUA">Conta de Água</option>
                        <option value="INTERNET">Internet</option>
                        <option value="MANUTENCAO">Manutenção</option>
                        <option value="OUTROS">Outros</option>
                    </Form.Select>

                    <BotaoCadastro para="/movimentacoes/novo" texto="Nova Movimentação" />
                </div>
            </div>

            {/* Exibição do Alerta de Erro */}
            {erro && (
                <Alert variant="danger" onClose={() => setErro('')} dismissible className="mb-4">
                    {erro}
                </Alert>
            )}

            {movimentacoes.length === 0 ? (
                <EstadoVazio mensagem="Nenhuma movimentação registrada para os filtros selecionados." />
            ) : (
                <Table hover responsive className="shadow-sm bg-white rounded">
                    <thead className="bg-light">
                        <tr>
                            <th>Data/Hora</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th className="text-end">Valor</th>
                            <th className="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.map((m) => (
                            <tr key={m.id}>
                                <td>{new Date(m.data_hora).toLocaleString('pt-BR')}</td>
                                <td>{m.descricao}</td>
                                <td>
                                    <Badge bg="secondary" className="text-uppercase">
                                        {m.categoria_movimentacao} 
                                    </Badge>
                                </td>
                                <td>
                                    <Badge bg={m.tipo_movimentacao === 'ENTRADA' ? 'success' : 'danger'}>
                                        {m.tipo_movimentacao}
                                    </Badge>
                                </td>
                                <td className={`text-end fw-bold ${m.tipo_movimentacao === 'ENTRADA' ? 'text-success' : 'text-danger'}`}>
                                    {m.tipo_movimentacao === 'ENTRADA' ? '+ ' : '- '}
                                    {m.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>

                                {/* Ações somente para SAÍDA */}
                                <td className="text-end">
                                    {m.tipo_movimentacao === 'SAIDA' && (
                                        <BotoesAcao
                                            id={m.id}
                                            rotaEditar={`/movimentacoes/editar/${m.id}`}
                                            onDelete={handleAbrirConfirmacao}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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

            {/* Modal de confirmação */}
            <ModalConfirmacao
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={confirmarExclusao}
                titulo="Confirmar Exclusão"
                mensagem="Deseja realmente excluir esta movimentação?"
            />
        </Container>
    );
};

export default MovimentacaoList;