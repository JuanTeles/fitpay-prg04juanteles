import { useEffect, useState } from 'react';
import { Container, Table, Badge, Form } from 'react-bootstrap'; 
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

    // Estados para os filtros
    const [tipoFilter, setTipoFilter] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');

    // Estados para exclusão
    const [showModal, setShowModal] = useState(false);
    const [movToDelete, setMovToDelete] = useState(null);

    // Carrega lista inicial
    useEffect(() => {
        fetchData();
    }, []);

    // Recarrega lista quando filtros mudam
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchData(tipoFilter, categoriaFilter);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [tipoFilter, categoriaFilter]);

    // Função para buscar movimentações
    const fetchData = async (tipo = '', categoria = '') => {
        try {
            setLoading(true);
            const data = await MovimentacaoService.findAll(0, 50, tipo, categoria);
            // Ordenar do mais recente para o mais antigo
            const ordenadas = (data.content || []).sort(
                (a, b) => new Date(b.data_hora) - new Date(a.data_hora)
            );
            setMovimentacoes(ordenadas);
        } catch (error) {
            console.error("Erro ao carregar movimentações");
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
            await MovimentacaoService.delete(movToDelete); // Chama o backend
            setMovimentacoes(prev => prev.filter(m => m.id !== movToDelete)); // Atualiza lista
            setShowModal(false);
            setMovToDelete(null);
        } catch (err) {
            console.error("Erro ao excluir movimentação");
        }
    };

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
                        onChange={(e) => setTipoFilter(e.target.value)}
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
                        onChange={(e) => setCategoriaFilter(e.target.value)}
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
