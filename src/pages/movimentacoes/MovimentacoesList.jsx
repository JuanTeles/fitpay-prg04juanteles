import React, { useEffect, useState } from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import MovimentacaoService from '../../services/MovimentacaoService';
import PageTitulo from '../../components/global/PageTitulo';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import EstadoVazio from '../../components/global/EstadoVazio';

const MovimentacaoList = () => {
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await MovimentacaoService.findAll(0, 50);
            setMovimentacoes(data.content || []);
        } catch (error) {
            console.error("Erro ao carregar movimentações");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CarregandoSpinner />;

    return (
        <Container className="py-4">
            <PageTitulo 
                titulo="Fluxo de Caixa" 
                subtitulo="Histórico de entradas e saídas financeiras" 
            />

            {movimentacoes.length === 0 ? (
                <EstadoVazio mensagem="Nenhuma movimentação registrada no período." />
            ) : (
                <Table hover responsive className="shadow-sm bg-white rounded">
                    <thead className="bg-light">
                        <tr>
                            <th>Data/Hora</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th className="text-end">Valor</th>
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MovimentacaoList;