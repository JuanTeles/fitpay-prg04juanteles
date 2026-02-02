import React from 'react';

const EstadoVazio = ({ icone, colSpan, mensagemVazia, temFiltro = false }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-5 text-muted">
        <i className={`bi ${icone} fs-1 d-block mb-2`}></i>
        {temFiltro ? 'Nenhum resultado encontrado.' : mensagemVazia}
      </td>
    </tr>
  );
};

export default EstadoVazio;
