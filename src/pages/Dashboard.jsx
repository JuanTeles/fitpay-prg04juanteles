import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AlunoService from '../services/AlunoService';
import MatriculaService from '../services/MatriculaService';
import '../styles/global.css';

const Dashboard = () => {
  // Estado para armazenar os indicadores
  const [kpis, setKpis] = useState({
    alunosAtivos: 0,
    matriculasMes: 0,
    aRenovar: 0
  });

  // Busca os dados ao carregar a página
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [alunosResponse, matriculasResponse, aRenovarResponse] = await Promise.all([
          // Busca total de alunos ativos
          AlunoService.findAll(0, 1, '', 'ATIVO'),

          // Busca novas matrículas do mês
          MatriculaService.getNovasNoMes(),

          // Busca matrículas a renovar (7 dias)
          MatriculaService.getARenovar()
        ]);

        setKpis({
          alunosAtivos: alunosResponse.totalElements || 0, 
          matriculasMes: matriculasResponse || 0,
          aRenovar: aRenovarResponse || 0
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container className="py-5">
      {/* --- Seção de Boas-vindas --- */}
      <div className="mb-4">
        <h2 className="fw-bold text-midnight">Painel Administrativo</h2>
        <p className="text-muted">Bem-vindo ao FitPay. Aqui está o resumo da sua academia.</p>
      </div>

      {/* --- Linha de KPIs (Indicadores) --- */}
      <Row className="mb-4 g-4">

        {/* Card 1: Alunos Ativos (DADOS REAIS) */}
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100 border-start border-4 border-primary">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-light rounded-circle p-3 me-3">
                <i className="bi bi-people-fill fs-3 text-energy"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Alunos Ativos</h6>
                {/* Exibe o valor do estado */}
                <h3 className="fw-bold text-midnight mb-0">{kpis.alunosAtivos}</h3>
                <small className="text-success fw-bold">Base Total</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 2: A Renovar (DADOS REAIS) */}
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100 border-start border-4 border-warning">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-light rounded-circle p-3 me-3">
                <i className="bi bi-stopwatch-fill fs-3 text-warning"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">A Renovar (7 dias)</h6>
                {/* Exibe o valor do estado */}
                <h3 className="fw-bold text-midnight mb-0">{kpis.aRenovar}</h3>
                <small className="text-muted">Risco de bloqueio</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 3: Novas Matrículas (DADOS REAIS) */}
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100 border-start border-4 border-success">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-light rounded-circle p-3 me-3">
                <i className="bi bi-person-plus-fill fs-3 text-success"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Novas Matrículas (Mês)</h6>
                {/* Exibe o valor do estado */}
                <h3 className="fw-bold text-success mb-0">{kpis.matriculasMes}</h3>
                <small className="text-success">
                  <i className="bi bi-graph-up-arrow me-1"></i>
                  Crescimento
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Seção de Acesso Rápido --- */}
      <h4 className="fw-bold text-midnight mb-3 mt-5">Gerenciamento Rápido</h4>

      <Row className="g-4 justify-content-center">

        {/* Botão: Planos */}
        <Col md={4} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center hover-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
              <i className="bi bi-card-checklist fs-1 text-energy mb-3"></i>
              <Card.Title>Planos</Card.Title>
              <Card.Text className="text-muted small">Crie e edite planos de matrícula.</Card.Text>
              <Link to="/planos">
                <Button variant="outline-secondary" size="sm" className="mt-2">Acessar</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Botão: Endereços */}
        <Col md={4} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center hover-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
              <i className="bi bi-geo-alt-fill fs-1 text-info mb-3"></i>
              <Card.Title>Endereços</Card.Title>
              <Card.Text className="text-muted small">Gerencie endereços.</Card.Text>
              <Link to="/enderecos">
                <Button variant="outline-secondary" size="sm" className="mt-2">Acessar</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Botão: Alunos */}
        <Col md={4} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center hover-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
              <i className="bi bi-person-badge fs-1 text-primary mb-3"></i>
              <Card.Title>Alunos</Card.Title>
              <Card.Text className="text-muted small">Gerencie matrículas e cadastros.</Card.Text>
              <Link to="/alunos">
                <Button variant="outline-secondary" size="sm" className="mt-2">Acessar</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Botão: Financeiro (Pagamentos) */}
        <Col md={4} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center hover-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
              <i className="bi bi-wallet2 fs-1 text-success mb-3"></i>
              <Card.Title>Pagamentos</Card.Title>
              <Card.Text className="text-muted small">Visualize os pagamentos realizados.</Card.Text>
              <Link to="/pagamento">
                <Button variant="outline-secondary" size="sm" className="mt-2">Acessar</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Botão: Movimentações */}
        <Col md={4} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center hover-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
              <i className="bi bi-graph-up-arrow fs-1 text-midnight mb-3"></i>
              <Card.Title>Movimentações</Card.Title>
              <Card.Text className="text-muted small">Relatórios e Fluxo de Caixa.</Card.Text>
              <Link to="/movimentacoes">
                <Button variant="outline-secondary" size="sm" className="mt-2">Acessar</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default Dashboard;