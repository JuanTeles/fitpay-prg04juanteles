import React from 'react';

const PageTitulo = ({ titulo, descricao }) => {
  return (
    <div className="text-center text-lg-start w-100 w-lg-auto">
      <h2 className="fw-bold text-midnight">{titulo}</h2>
      {descricao && <p className="text-muted mb-0">{descricao}</p>}
    </div>
  );
};

export default PageTitulo;
