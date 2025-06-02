# README - Projeto Music Stream

Este é um projeto full stack que simula um app de stream de musica, que consiste em um cliente Vue.js 3 e um servidor Node.js/Express, com suporte a testes unitários e de integração.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior) ou yarn
- SQLite3 (para o banco de dados do servidor)

## 🛠 Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   ```

2. Instale as dependências tanto para o cliente quanto para o servidor:
   ```bash
   npm install
   cd apps/client && npm install
   cd ../server && npm install
   ```

## 🚀 Executando o Projeto

Para executar tanto o cliente quanto o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Isso iniciará:
- O cliente Vue.js na porta 5173 (acessível em http://localhost:5173)
- O servidor Node.js na porta 3000 (acessível em http://localhost:3000)

## 🔨 Build

Para construir o cliente para produção:

```bash
cd apps/client
npm run build
```

O build será gerado na pasta `dist`.

## 🧪 Testes

### Cliente (Vue.js)

Para executar os testes do cliente:

```bash
cd apps/client

# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage
```

### Servidor (Node.js/Express)

Para executar os testes do servidor:

```bash
cd apps/server

# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Testes de integração
npm run test:integration
```

## ⚠️ Atenção Importante

A API utilizada neste projeto está **em desenvolvimento e pode ser instável**. Algumas considerações:

- Endpoints podem mudar sem aviso prévio
- Funcionalidades podem estar incompletas
- Podem ocorrer erros inesperados durante o uso

Recomendamos verificar regularmente por atualizações e relatar quaisquer problemas encontrados.

## 📦 Dependências Principais

### Cliente
- Vue.js 3
- Vite
- Bootstrap 5
- Vitest (para testes)
- Axios (para requisições HTTP)

### Servidor
- Express
- Knex (Query Builder)
- SQLite3 (banco de dados)
- Jest (para testes)
