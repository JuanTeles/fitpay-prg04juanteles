import React, { useEffect } from 'react';

const Cadastro = () => {
    useEffect(() => {
        // Define o título da página quando o componente é montado 
        document.title = 'Cadastro';
    }, []); // O array vazio [] garante que a função rode apenas uma vez


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card">
                        <div className="card-body col-11 col-md-10 mx-auto py-4">
                            <h1 className="card-title text-center text-azul display-4 mb-3">Cadastro</h1>

                            <form className="row g-3" onSubmit={(e) => e.preventDefault()}> 
                                <div className="col-12">
                                    <label htmlFor="email" className="form-label fs-6">Email</label>
                                    <input type="email" className="form-control" id="email" name="email" required />
                                </div>
                                
                                <div className="col-12">
                                    <label htmlFor="nome-academia" className="form-label fs-6">Academia</label>
                                    <input type="text" className="form-control" id="nome-academia" name="nome-academia" required />
                                </div>
                                
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="telefone" className="form-label fs-6">Telefone</label>
                                    <input type="tel" className="form-control" id="telefone" name="telefone" required />
                                </div>
                                
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="cnpj" className="form-label fs-6">CNPJ</label>
                                    <input type="text" className="form-control" id="cnpj" name="cnpj" required />
                                </div>
                                
                                <div className="col-12">
                                    <label htmlFor="senha" className="form-label fs-6">Senha</label>
                                    <input type="password" className="form-control" id="senha" name="senha" required />
                                </div>
                                
                                <div className="col-12 text-center">
                                    {/* O botão de submit no React sera usado para chamar uma função de submissão */}
                                    <button className="btn btn-primary fs-5" type="submit">Cadastrar</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;