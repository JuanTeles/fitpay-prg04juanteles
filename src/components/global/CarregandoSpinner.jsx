import React from 'react';
import { Spinner } from 'react-bootstrap';

const CarregandoSpinner = ({ mensagem = 'Carregando...' }) => {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">{mensagem}</p>
    </div>
  );
};

export default CarregandoSpinner;
