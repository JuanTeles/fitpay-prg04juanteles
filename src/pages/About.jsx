import React, { useEffect } from 'react';

const About = () => {
    useEffect(() => {
        // Define o título da página quando o componente é montado 
        document.title = 'Sobre';
    }, []); // O array vazio [] garante que a função rode apenas uma vez

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card">
                            <div className="card-body d-grid gap-2 col-lg-8 col-12 mx-auto py-5">
                                <h1 className="card-title text-center text-azul display-3 mb-3">
                                FitPay
                                </h1>
                                <h5 className="card-subtitle mb-4 text-muted text-center fs-4">
                                Sua gestão financeira, mais forte que nunca.
                                </h5>
                                <p className="text-center mb-0 fs-6">
                                FitPay é a solução completa para academias que desejam otimizar o fluxo de caixa, controlar mensalidades e gerenciar despesas de forma simples e eficiente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;