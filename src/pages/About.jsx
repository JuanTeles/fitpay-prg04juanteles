import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PageTitulo from '../components/global/PageTitulo';

const About = () => {
    useEffect(() => {
        document.title = 'Sobre - FitPay';
    }, []);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-5 text-center">
                            {/* Título da Marca */}
                            <h1 className="display-3 fw-bold text-secondary mb-3">
                                Fit<span style={{ color: 'var(--primary-color)' }}>Pay</span>
                            </h1>
                            
                            {/* Subtítulo / Slogan */}
                            <h2 className="h4 text-secondary mb-4">
                                Sua gestão financeira, mais forte que nunca.
                            </h2>
                            
                            {/* Texto Descritivo */}
                            <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                FitPay é a solução completa para academias que desejam otimizar o fluxo de caixa, 
                                controlar mensalidades e gerenciar despesas de forma simples e eficiente.
                            </p>

                            {/* Rodapé do Card (Opcional, para versão) */}
                            <div className="mt-5 pt-4 border-top">
                                <small className="text-muted">Versão 1.0.0 &copy; 2026 FitPay Inc.</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;