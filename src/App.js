import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Header from './components/Header';
import Footer from './components/Footer';

import Dashboard from './pages/Dashboard';
import About from './pages/About'; 
import PlanoList from './pages/planos/PlanoList';
import PlanoForm from './pages/planos/PlanoForm';
import EnderecoList from './pages/enderecos/EnderecoList';
import EnderecoForm from './pages/enderecos/EnderecoForm';
import AlunoList from './pages/alunos/AlunoList';

const App = () => {
    return (
        // Esta <div> simula as classes do body (d-flex flex-column min-vh-100)
        <div className="d-flex flex-column min-vh-100"> 
            <Header />
            
            {/* O <main> com flex-grow-1 garante que o conteúdo das Rotas ocupe o espaço restante */}
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <Routes>
                    {/* 1. Rota para o Dashboard Inicial */}
                    <Route path="/" element={<Dashboard />} />

                    {/* 2. Rota para a Página Sobre */}
                    <Route path="/about" element={<About />} />

                    {/* Rotas de Planos (Sprint 1) */}
                    <Route path="/planos" element={<PlanoList />} />
                    <Route path="/planos/novo" element={<PlanoForm />} />
                    <Route path="/planos/editar/:id" element={<PlanoForm />} />

                    {/* Rotas de Endereços (Sprint 1) */}
                    <Route path="/enderecos" element={<EnderecoList />} />
                    <Route path="/enderecos/novo" element={<EnderecoForm />} />
                    <Route path="/enderecos/editar/:id" element={<EnderecoForm />} />

                    {/* Rotas de Alunos (Sprint 2) */}
                    <Route path="/alunos" element={<AlunoList />} />
                </Routes>
            </main>

            <Footer />
        
        </div>
    );
};

export default App;