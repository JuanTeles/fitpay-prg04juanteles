import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import '../styles/global.css'; 

const Header = () => {
  const expand = 'lg'; // Define em qual tamanho o menu vira hambúrguer

  return (
    <Navbar
      expand={expand}
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

        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        
        {/* Substituído Navbar.Collapse por Navbar.Offcanvas para menu lateral */}
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          style={{ backgroundColor: 'var(--secondary-color)' }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="text-white">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={NavLink} to="/" end className="text-light">
                Dashboard
              </Nav.Link>

              <Nav.Link as={NavLink} to="/planos" className="text-light">
                Planos
              </Nav.Link>
              
              <Nav.Link as={NavLink} to="/alunos" className="text-light">
                Alunos
              </Nav.Link>
              
              <Nav.Link as={NavLink} to="/movimentacoes" className="text-light">
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
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Header;