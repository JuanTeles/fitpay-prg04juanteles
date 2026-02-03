# 🏋️‍♂️ FitPay - Frontend

> Sistema de Gestão de Academias desenvolvido como parte dos requisitos do curso de Análise e Desenvolvimento de Sistemas.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## 📋 Sobre o Projeto

O **FitPay** é uma aplicação Single Page Application (SPA) focada na administração eficiente de academias. O sistema permite o controle de alunos, gestão financeira (fluxo de caixa), criação de planos de matrícula e monitoramento de indicadores de desempenho (KPIs) através de um dashboard interativo.

O projeto foi estruturado utilizando **React.js** com uma arquitetura baseada em serviços para consumo de API REST.

---

## 🚀 Funcionalidades Principais

### 📊 Dashboard Administrativo
- Visualização rápida de KPIs: Alunos Ativos, Matrículas no Mês e Renovações Pendentes.
- Navegação rápida para os principais módulos do sistema.

### 👥 Gestão de Alunos
- **CRUD Completo:** Cadastro, Listagem, Edição e Exclusão.
- **Filtros Inteligentes:** Busca por nome/CPF e status (Ativo/Inativo).
- **Matrícula:** Fluxo dedicado para realizar e renovar matrículas.

### 💰 Financeiro
- **Movimentações:** Registro de entradas e saídas.
- **Pagamentos:** Histórico visual de pagamentos com status colorido (Pendente, Pago, Atrasado).

### 📝 Cadastros Auxiliares
- **Planos:** Configuração de mensalidades e pacotes.
- **Endereços:** Gestão de localidades.

---

## 🏗️ Arquitetura e Estrutura

O projeto segue uma organização modular para facilitar a escalabilidade e manutenção:

```text
src/
├── api/                # Configuração do Axios (Base URL e Headers)
├── components/         # Componentes Reutilizáveis
│   ├── global/         # Header, Footer, Modais, Spinners
│   ├── matricula/      # Modais específicos de matrícula
│   └── ...
├── pages/              # Telas da aplicação (Views)
│   ├── alunos/         # Listagem e Formulário de Alunos
│   ├── dashboard/      # Tela inicial com gráficos/KPIs
│   ├── financeiro/     # Movimentações e Pagamentos
│   └── ...
├── services/           # Camada de Serviço (Lógica de API isolada)
└── styles/             # Estilos globais e variáveis CSS (:root)

```

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído sobre uma stack moderna e robusta:

* ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React.js:** Biblioteca principal para interfaces dinâmicas.
* ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white) **Routing:** Gerenciamento de rotas e navegação SPA.
* ![Bootstrap](https://img.shields.io/badge/Bootstrap_5-563D7C?style=flat-square&logo=bootstrap&logoColor=white) **UI Framework:** Grid system e componentes responsivos.
* ![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=flat-square&logo=axios&logoColor=white) **Client HTTP:** Comunicação assíncrona com a API REST.
* ![Icons](https://img.shields.io/badge/Bootstrap_Icons-UI-0D6EFD?style=flat-square&logo=bootstrap&logoColor=white) **Iconografia:** Ícones vetoriais leves e semânticos.

---

## 🏗️ Arquitetura do Projeto

A estrutura de pastas segue o padrão de **Separação de Interesses (SoC)**, isolando a lógica de negócios da interface visual:

```text
src/
├── 📂 api/             # Configuração centralizada do Axios (Base URL)
├── 📂 components/      # Componentes visuais
│   ├── 📂 global/      # Header, Footer, Loaders, Modais (Reutilizáveis)
│   └── 📂 matricula/   # Componentes específicos de negócio
├── 📂 pages/           # Views (Telas) da aplicação
│   ├── 📂 alunos/      # Listagem e Formulários de Alunos
│   ├── 📂 dashboard/   # Painel de KPIs e Gráficos
│   └── ...
├── 📂 services/        # Camada de Serviço (Chamadas à API Backend)
└── 📂 styles/          # Estilização global e variáveis CSS (:root)
```

---

## 📅 Etapas de Desenvolvimento (Sprints)

O desenvolvimento foi dividido em fases estratégicas para garantir a entrega contínua de valor. A estrutura de rotas reflete essa evolução:

### 🏁 Sprint 1: Estrutura & Cadastros Base
* **Configuração Inicial:** Setup do ambiente React, instalação de dependências (Bootstrap, Axios) e definição do layout base (Header e Footer).
* **Módulo de Planos:** Funcionalidades de listagem, cadastro e edição de planos da academia.
* **Módulo de Endereços:** Gerenciamento de localidades.

### 👥 Sprint 2: Gestão de Pessoas (Core)
* **Módulo de Alunos:** CRUD completo com validações de formulário.
* **Matrículas:** Implementação da lógica de matrícula (associação Aluno x Plano).
* **Histórico:** Visualização de matrículas anteriores e status de cada uma.

### 📈 Sprint 3: Financeiro & Inteligência
* **Controle Financeiro:** Listagem de pagamentos e fluxo de caixa (Movimentações).
* **Dashboard:** Criação da tela inicial com indicadores (KPIs) de alunos ativos, renovações e novas matrículas.
* **Refinamento de UX:** Melhorias visuais, feedbacks de carregamento e tratamento de erros.

---

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em seu ambiente local.

### Pré-requisitos
* **Node.js** (Versão 16 ou superior)
* **Gerenciador de Pacotes** (NPM ou Yarn)
* **API Backend** rodando (Padrão: `http://localhost:8080`)

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/fitpay-frontend.git](https://github.com/seu-usuario/fitpay-frontend.git)
cd fitpay-frontend
```
### 2. Instalar Dependências
```bash
npm install
# ou
yarn install
```
### 3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto para definir o endereço da API:
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
```
### 4. Executar a Aplicação
```bash
npm start
```
O projeto será aberto automaticamente no navegador em http://localhost:3000.

---

## 🎨 UX/UI e Responsividade

A experiência do usuário foi um pilar central no desenvolvimento, garantindo que o sistema seja intuitivo e acessível em diferentes dispositivos.

### 🚦 Feedback Visual & Semântica
* **Cores com Significado:** O sistema utiliza uma paleta de cores semântica definida globalmente:
    * 🟢 **Verde (`--status-success`):** Para status "Ativo", "Pago" ou "Entradas".
    * 🔴 **Vermelho (`--status-danger`):** Para "Inativo", "Atrasado" ou "Saídas".
    * 🟡 **Amarelo (`--status-warning`):** Para alertas de "Renovação Próxima".
* **Estados de Carregamento:** O uso de *Spinners* durante as requisições à API impede que o usuário interaja com uma tela "congelada" ou vazia, informando claramente que os dados estão sendo processados.

---

### Desenvolvido por Juan Teles