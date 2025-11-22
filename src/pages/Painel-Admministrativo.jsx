import React, { useEffect } from 'react';

const Painel = () => {
  useEffect(() => {
    // Define o título da página
    document.title = 'FitPay - Painel';
  }, []);

  // Nota: Em um projeto real, esta lista seria gerenciada pelo 'useState' e viria de uma API.
  const academias = [
    { nome: 'Academia Força Total', email: 'contato@forccatotal.com', cnpj: '12.345.678/0001-99' },
    { nome: 'Maromba Fitness', email: 'admin@marombafitness.com.br', cnpj: '98.765.432/0001-11' },
    { nome: 'Studio Corpo em Movimento', email: 'financeiro@corpoemovimento.com', cnpj: '11.222.333/0001-44' },
  ];

  return (
    <div className="container my-5">
      <h1 className="display-4 text-center text-azul mb-4">Painel de Administração</h1>
      
      <div className="table-responsive">
        {/* conversão da Tabela */}
        <table className="table table-striped table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome da Academia</th>
              <th>E-mail</th>
              <th>CNPJ</th>
              <th className="text-center">Editar</th>
              <th className="text-center">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeamento de dados no React para gerar as linhas */}
            {academias.map((academia, index) => (
              <tr key={index}>
                <td>{academia.nome}</td>
                <td>{academia.email}</td>
                <td>{academia.cnpj}</td>
                <td className="text-center">
                  <button className="btn btn-primary btn-sm">Editar</button>
                </td>
                <td className="text-center">
                  <button className="btn btn-danger btn-sm">Excluir</button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Painel;