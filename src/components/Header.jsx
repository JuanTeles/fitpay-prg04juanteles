import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    {/* Link principal (marca) */}
                    <NavLink className="navbar-brand text-azul" to="/">
                        FitPay
                    </NavLink>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                {/* O 'end' garante que 'Inicio' só fique ativo na rota exata '/' */}
                                <NavLink to="/" end className="nav-link">
                                    Inicio
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/fluxo" className="nav-link">
                                    Fluxo
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/mensalidades" className="nav-link">
                                    Mensalidades
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about" className="nav-link">
                                    Sobre
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;