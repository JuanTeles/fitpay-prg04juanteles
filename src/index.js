import React from 'react';
import ReactDOM from 'react-dom/client';
// importação necessária para o roteamento para o github pages
import { BrowserRouter } from 'react-router-dom'; 

// Importação do bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importação do CSS Customizado
import './styles/global.css'; 

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
     <React.StrictMode>
        {/* Define a base do roteamento como o nome do repositório para funcionar no GitHub Pages. */}
        <BrowserRouter basename="/fitpay-prg04juanteles"> 
          <App />
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();