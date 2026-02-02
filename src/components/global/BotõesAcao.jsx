import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BotõesAcao = ({ id, rotaEditar, onDelete, iconeEditar = 'bi-pencil-square', iconeDeletar = 'bi-trash' }) => {
  return (
    <div className="d-flex align-items-center justify-content-end gap-3">
      {/* Botão Editar */}
      <Link to={rotaEditar} className="text-primary" title="Editar">
        <i className={`bi ${iconeEditar} fs-5`}></i>
      </Link>

      {/* Botão Excluir */}
      <Button 
        variant="link" 
        className="text-danger p-0 border-0" 
        title="Excluir"
        onClick={() => onDelete(id)}
      >
        <i className={`bi ${iconeDeletar} fs-5`}></i>
      </Button>
    </div>
  );
};

export default BotõesAcao;
