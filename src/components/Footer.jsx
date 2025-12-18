import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="mt-auto py-3" style={{ backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
      <Container className="text-center text-muted">
        <small>
          &copy; {new Date().getFullYear()} <strong>FitPay</strong> - Gestão Inteligente de Academias.
          <br />
        </small>
      </Container>
    </footer>
  );
};

export default Footer;