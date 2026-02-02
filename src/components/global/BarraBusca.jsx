import React from 'react';
import { Form } from 'react-bootstrap';

const BarraBusca = ({ placeholder, value, onChange, style }) => {
  return (
    <Form.Control
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ minWidth: '280px', ...style }}
      className="shadow-sm"
    />
  );
};

export default BarraBusca;
