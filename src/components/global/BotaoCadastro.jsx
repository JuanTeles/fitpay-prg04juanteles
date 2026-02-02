import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BotaoCadastro = ({ para, texto, icone = 'bi-plus-lg' }) => {
  return (
    <Link to={para} className="d-block d-md-inline-block">
      <Button variant="primary" className="fw-bold shadow-sm text-nowrap w-100 w-md-auto">
        <i className={`bi ${icone} me-2`}></i>
        {texto}
      </Button>
    </Link>
  );
};

export default BotaoCadastro;
