# Dashboard Generator Backend

Este projeto é um backend desenvolvido em TypeScript para uma ferramenta de geração de dashboards. Ele permite criar, editar, atualizar e excluir dashboards, gráficos e filtros, além de armazenar e gerenciar dados relacionados para visualização.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do JavaScript no backend.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
- **Express.js**: Framework minimalista para criação de servidores web.
- **Prisma**: ORM para manipulação e gerenciamento do banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar informações dos dashboards, gráficos e filtros.
- **Nodemon**: Ferramenta de desenvolvimento que reinicia automaticamente o servidor quando alterações no código são detectadas.

## Funcionalidades

- **CRUD de Dashboards**: Criação, leitura, atualização e exclusão de dashboards.
- **CRUD de Charts**: Manipulação de gráficos para visualização de dados dentro dos dashboards.
- **CRUD de Filtros**: Aplicação e gerenciamento de filtros dinâmicos para personalização da exibição dos dashboards.
- **Importação de Dados via CSV**: Permite o upload de arquivos CSV para popular os gráficos com dados customizados.
- **Gestão de KPIs**: Criação e gerenciamento de KPIs dentro dos dashboards.
- **Controle de Acesso**: Define se um dashboard é público ou privado, permitindo ou restringindo o acesso conforme configurado.

## Estrutura do Projeto

```
.
├── src
│   ├── controllers
│   ├── middlewares
│   ├── routes
│   ├── services
│   ├── types
│   ├── prisma
│   └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

- **controllers**: Contém a lógica dos endpoints da aplicação.
- **middlewares**: Armazena middlewares para validação e manipulação de requisições.
- **routes**: Define as rotas para cada funcionalidade da aplicação.
- **services**: Contém a lógica de negócio, conectando os controladores ao banco de dados.
- **types**: Define tipos e interfaces utilizados pela aplicação.
- **prisma**: Configurações e definições de esquema para o ORM Prisma.
- **index.ts**: Arquivo principal que inicia o servidor.

## Pré-requisitos

- **Node.js** v14+
- **npm** ou **yarn**
- **PostgreSQL**
- **Docker** (opcional, para desenvolvimento em containers)

## Instalação e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/dashboard-generator-backend.git
   cd dashboard-generator-backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` com as seguintes variáveis:

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   PORT=3000
   ```

4. **Execute as migrações do Prisma:**

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie a aplicação em modo de desenvolvimento:**

   ```bash
   npm run dev
   ```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com Nodemon.
- `npm run build`: Compila o código TypeScript para JavaScript.
- `npm start`: Inicia o servidor em produção.
- `npm run prisma:migrate`: Executa as migrações do banco de dados.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch com sua feature: `git checkout -b minha-feature`.
3. Faça o commit das suas alterações: `git commit -m 'Adiciona nova funcionalidade'`.
4. Envie para o branch principal: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

Sinta-se à vontade para adaptar este modelo conforme as especificidades do seu projeto.
