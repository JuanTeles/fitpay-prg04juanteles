import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        // Define o título da página quando o componente é montado 
        document.title = 'Home';
    }, []); // O array vazio [] garante que a função rode apenas uma vez

    return (
        <div className="container margem-container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card">
                        <div className="card-body py-5 text-center">
                            <h2 className="card-title text-center text-azul mb-3 display-3">
                                FitPay
                            </h2>
                            <h6 className="card-subtitle mb-4 text-muted fs-4 text-center">
                                Sua gestão financeira, mais forte que nunca.
                            </h6>

                            <div className="d-grid gap-2 col-8 mx-auto">
                                <Link
                                className="btn btn-laranja fs-5"
                                to="/cadastro"
                                role="button"
                                >
                                Cadastrar
                                </Link>
                                <Link
                                className="btn btn-laranja fs-5"
                                to="/login"
                                role="button"
                                >
                                Entrar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;