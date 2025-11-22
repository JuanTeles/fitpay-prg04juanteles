import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    // Inicializa a função de navegação (simular o botao de login temporariamente)
    const navigate = useNavigate(); 
    
    useEffect(() => {
        // Define o título da página
        document.title = 'FitPay - Login'; 
    }, []);

    // Função de Submissão do Formulário 
    const handleSubmit = (e) => {
        e.preventDefault(); // Impede o recarregamento padrão da página

        // A lógica REAL de autenticação (API, validação de senha) 
        // iria aqui. Se a autenticação for bem-sucedida, fazemos o redirecionamento:
        
        console.log("Tentativa de login...");
        
        // Simulação de Sucesso: Redireciona para a rota /paineladm
        navigate('/paineladm'); 
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card">
                        <div className="card-body col-11 col-md-10 mx-auto py-4">
                            <h1 className="card-title text-center text-azul display-4 mb-3">Login</h1>

                            {/* chamada da função handleSubmit no onSubmit  */}
                            <form className="row g-3" onSubmit={handleSubmit}> 
                                <div className="col-12">
                                    <label htmlFor="email" className="form-label fs-6">Email</label>
                                    <input type="email" className="form-control" id="email" name="email" required />
                                </div>
                                
                                <div className="col-12">
                                    <label htmlFor="senha" className="form-label fs-6">Senha</label>
                                    <input type="password" className="form-control" id="senha" name="senha" required />
                                </div>
                                
                                <div className="col-12 text-center">
                                    <button className="btn btn-primary fs-5" type="submit">Entrar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;