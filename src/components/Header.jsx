import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import '../styles/global.css'; 

const Header = () => {

  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{
        backgroundColor: 'var(--secondary-color)',
        height: 'var(--navbar-height)',
      }}
    >
      <Container>
        {/* LOGO: Texto forte + Ponto laranja */}
        <Navbar.Brand as={NavLink} to="/" end className="fw-bold fs-3">
          Fit<span style={{ color: 'var(--primary-color)' }}>Pay</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end className="text-light">
              Dashboard
            </Nav.Link>

            <Nav.Link as={NavLink} to="/planos" className="text-light">
              Planos
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/alunos" className="text-light">
              Alunos
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/financeiro" className="text-light">
              Financeiro
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Navbar.Text className="text-white me-3">
              Olá, <strong>Admin</strong>
            </Navbar.Text>
            { /*
            <Button variant="light" size="sm" className="text-dark fw-bold">
              Sair
            </Button>
            */ }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
