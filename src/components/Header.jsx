import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import '../styles/global.css'; 

const Header = () => {
  return (
    <Navbar expand="lg" variant="dark" style={{ backgroundColor: 'var(--secondary-color)', height: 'var(--navbar-height)' }}>
      <Container>
        {/* LOGO: Texto forte + Ponto laranja */}
        <Navbar.Brand href="/" className="fw-bold fs-3">
          Fit<span style={{ color: 'var(--primary-color)' }}>Pay</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="text-light">Dashboard</Nav.Link>
            <Nav.Link href="/planos" className="text-light opacity-75 hover-opacity-100">Planos</Nav.Link>
            <Nav.Link href="/alunos" className="text-light opacity-75">Alunos</Nav.Link>
            <Nav.Link href="/financeiro" className="text-light opacity-75">Financeiro</Nav.Link>
          </Nav>
          
          <Nav>
            <Navbar.Text className="text-white me-3">
              Olá, <strong>Admin</strong>
            </Navbar.Text>
            { /*
            <Button variant="light" size="sm" className="text-dark fw-bold">
              Sair
            </Button>
            */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;