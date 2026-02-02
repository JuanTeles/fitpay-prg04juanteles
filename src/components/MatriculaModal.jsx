import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import PlanoService from '../services/PlanoService';
import MatriculaService from '../services/MatriculaService';

const MatriculaModal = ({ show, handleClose, aluno }) => {
    // Estados para armazenar os dados do formulário
    const [planos, setPlanos] = useState([]);
    const [planoSelecionadoId, setPlanoSelecionadoId] = useState('');
    const [metodoPagamento, setMetodoPagamento] = useState('');
    
    const [dataInicio, setDataInicio] = useState(() => {
        const hoje = new Date();
        // Ajusta o fuso horário (UTC -> Local) para garantir a data correta no input
        const offset = hoje.getTimezoneOffset(); 
        const dataLocal = new Date(hoje.getTime() - (offset * 60 * 1000)); 
        return dataLocal.toISOString().slice(0, 10);
    });
    
    // A data fim é calculada calculada automaticamente
    const [dataFim, setDataFim] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carrega os planos assim que o modal abrir
    useEffect(() => {
        if (show) {
            carregarPlanos();
            // Reseta os estados para garantir o formulário limpo a cada abertura
            setError(null);
            setPlanoSelecionadoId('');
            setDataFim('');
        }
    }, [show]);

    // Calcula a Data Fim automaticamente
    // Toda vez que o usuário mudar o "Plano" ou a "Data Início" a data é recalculada.
    useEffect(() => {
        if (planoSelecionadoId && dataInicio) {
            const plano = planos.find(p => p.id === parseInt(planoSelecionadoId));
            
            if (plano && plano.duracao_dias) {
                // Cria a data definindo a hora para 12:00 (meio-dia)
                // Isso evita que o fuso horário empurre a data para o dia anterior
                const dataIni = new Date(dataInicio + 'T12:00:00'); 
                const dataCalculada = new Date(dataIni);
                
                dataCalculada.setDate(dataCalculada.getDate() + plano.duracao_dias);
                
                // Formata para YYYY-MM-DD
                setDataFim(dataCalculada.toISOString().slice(0, 10));
            }
        }
    }, [planoSelecionadoId, dataInicio, planos]);

    const carregarPlanos = async () => {
        try {
            // Busca os planos para preencher o <select>
            const response = await PlanoService.findAll(0, 100); 
            // Tratamento de segurança caso o backend retorne paginado (.content) ou lista direta
            setPlanos(response.content || response || []);
        } catch (err) {
            setError("Erro ao carregar lista de planos.");
        }
    };

    const handleSalvar = async () => {
        // Validação básica no Front antes de enviar
        if (!planoSelecionadoId) {
            alert("Por favor, selecione um plano.");
            return;
        }

        if (!metodoPagamento) {
            alert("O pagamento é obrigatório para confirmar a matrícula.");
            return;
        }

        if (!dataFim) {
            alert("Erro ao calcular data de término. Verifique o plano.");
            return;
        }

        try {
            setLoading(true);
            const novaMatricula = {
                aluno: { id: aluno.id },       
                plano: { id: planoSelecionadoId }, 
                data_inicio: dataInicio,       
                data_fim: dataFim,             
                metodo_pagamento: metodoPagamento || null,
                status: "ATIVO"                
            };

            // Envia para o backend
            await MatriculaService.create(novaMatricula);
            
            alert(`Matrícula de ${aluno.nome} realizada com sucesso!`);
            handleClose(); // Fecha o modal após sucesso
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao salvar a matrícula. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-midnight">Nova Matrícula</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {aluno && <p className="text-muted">Aluno: <strong>{aluno.nome}</strong></p>}
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form>
                    {/* Seleção do Plano */}
                    <Form.Group className="mb-3">
                        <Form.Label>Selecione o Plano</Form.Label>
                        <Form.Select 
                            value={planoSelecionadoId} 
                            onChange={(e) => setPlanoSelecionadoId(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {planos.map(plano => (
                                <option key={plano.id} value={plano.id}>
                                    {/* Exibimos Nome, Valor e Duração para o usuário saber o que está comprando */}
                                    {plano.nome} - R$ {plano.valor} ({plano.duracao_dias} dias)
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <div className="row">
                        {/* Data Início (Editável) */}
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Data de Início</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={dataInicio} 
                                    onChange={(e) => setDataInicio(e.target.value)} 
                                />
                            </Form.Group>
                        </div>
                        
                        {/* Data Fim (Calculada - Read Only) */}
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Data de Fim (Calculada)</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={dataFim} 
                                    disabled 
                                    className="bg-light"
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* Método de Pagamento */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Método de Pagamento</Form.Label>
                        <Form.Select 
                            value={metodoPagamento} 
                            onChange={(e) => setMetodoPagamento(e.target.value)}
                            required
                            className={!metodoPagamento ? "border-danger" : "border-success"}
                        >
                            <option value="">Selecione o método de pagamento...</option> {/* Placeholder vazio força a escolha */}
                            <option value="PIX">PIX</option>
                            <option value="CARTAO">Cartão</option>
                            <option value="DINHEIRO">Dinheiro</option>
                        </Form.Select>
                        {!metodoPagamento && (
                            <Form.Text className="text-danger">
                                * É necessário registrar o pagamento para ativar a matrícula.
                            </Form.Text>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="success" onClick={handleSalvar} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Confirmar Matrícula'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MatriculaModal;