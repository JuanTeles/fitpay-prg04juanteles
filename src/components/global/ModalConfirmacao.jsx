import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalConfirmacao = ({ show, onHide, onConfirm, titulo, mensagem, variant = "danger" }) => {
  return (
    <Modal show={show} onHide={onHide} centered border-0 shadow>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensagem}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmacao;