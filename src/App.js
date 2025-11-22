import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About'; 
import Cadastro from './pages/Cadastro'; 
import Login from './pages/Login'; 
import Painel from './pages/Painel-Admministrativo'; 

const App = () => {
    return (
        // Esta <div> simula as classes do body (d-flex flex-column min-vh-100)
        <div className="d-flex flex-column min-vh-100"> 
            <Router>
                <Header />
                
                {/* O <main> com flex-grow-1 garante que o conteúdo das Rotas ocupe o espaço restante */}
                <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <Routes>
                        {/* 1. Rota para a Home Page */}
                        <Route path="/" element={<Home />} />

                        {/* 2. Rota para a Página Sobre */}
                        <Route path="/about" element={<About />} />

                        {/* 3. Rota para a Página de Cadastro */}
                        <Route path="/cadastro" element={<Cadastro />} />
                        
                        {/* 4. Rota para a Página de Cadastro */}
                        <Route path="/login" element={<Login />} />

                        {/* 5. Rota para a Página de Painel Administrativo */}
                        <Route path="/paineladm" element={<Painel />} />

                        {/* Rotas futuras a serem criadas */}
                        <Route path="/fluxo" element={<h1>Página de Fluxo de Caixa</h1>} />
                        <Route path="/mensalidades" element={<h1>Página de Mensalidades</h1>} />
                    </Routes>
                </main>

                <Footer />
            </Router>
        </div>
    );
};

export default App;