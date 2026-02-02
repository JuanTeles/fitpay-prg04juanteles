import React, { useEffect, useState } from 'react';
import { Container, Table, Card, Alert, Badge } from 'react-bootstrap';
import ModalConfirmacao from '../../components/ModalConfirmacao';
import PageTitulo from '../../components/global/PageTitulo';
import BotaoCadastro from '../../components/global/BotaoCadastro';
import BotõesAcao from '../../components/global/BotõesAcao';
import EstadoVazio from '../../components/global/EstadoVazio';
import CarregandoSpinner from '../../components/global/CarregandoSpinner';
import PlanoService from '../../services/PlanoService';

const PlanoList = () => {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para o Modal de Exclusão
    const [showModal, setShowModal] = useState(false);
    const [planoToDelete, setPlanoToDelete] = useState(null);

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

    const handleAbrirConfirmacao = (id) => {
        setPlanoToDelete(id);
        setShowModal(true);
    };

    const confirmarExclusao = async () => {
        try {
            await PlanoService.delete(planoToDelete);
            setPlanos(planos.filter(p => p.id !== planoToDelete));
            setShowModal(false); // Fecha o modal
            setPlanoToDelete(null); // Limpa o ID
        } catch (err) {
            alert('Erro ao excluir o plano.');
            setShowModal(false);
        }
    };

    return (
        <Container className="py-5">
            
            {/* Cabeçalho da Página */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center mb-4 gap-3">
                <PageTitulo titulo="Planos" descricao="Gerencie os pacotes de matrícula da academia." />
                <BotaoCadastro para="/planos/novo" texto="Novo Plano" />
            </div>

            {/* Alerta de Erro (se houver) */}
            {error && <Alert variant="danger">{error}</Alert>}

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