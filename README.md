# Hub de Eventos API

API RESTful para cadastro de usuários e eventos, com marcação e cancelamento de presença e controle de vagas disponíveis. Feita com Node.js, Express, TypeScript, Sequelize, PostgreSQL e Swagger.

## Pré-requisitos

- Node.js 22 ou superior
- pnpm 11 (`npm install -g pnpm@11`)
- PostgreSQL local **ou** Docker Desktop

## Como rodar

### Opção 1: com Docker (mais simples)

```bash
docker compose up --build
```

Esse comando sobe a API e o PostgreSQL e cria as tabelas automaticamente. Para parar, use `Ctrl+C`; para apagar também os dados, use `docker compose down -v`.

### Opção 2: localmente

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie o `.env` a partir do modelo e ajuste usuário e senha do seu PostgreSQL:

   ```bash
   cp .env.example .env
   ```

3. Crie o banco `hub_eventos` (pelo pgAdmin ou com o comando abaixo) e rode as migrations:

   ```bash
   psql -U postgres -c "CREATE DATABASE hub_eventos;"
   pnpm db:migrate
   ```

4. Inicie o servidor:

   ```bash
   pnpm dev
   ```

## Como usar

Com o servidor no ar, acesse **http://localhost:3000/api-docs**, abra um endpoint, clique em **Try it out** e depois em **Execute**.

| Método | Rota                                    | Descrição                     |
| ------ | --------------------------------------- | ----------------------------- |
| GET    | `/api/health`                           | Status do servidor            |
| GET    | `/api/usuarios`                         | Lista usuários                |
| GET    | `/api/usuarios/:id`                     | Busca um usuário              |
| POST   | `/api/usuarios`                         | Cadastra um usuário           |
| PUT    | `/api/usuarios/:id`                     | Atualiza um usuário           |
| DELETE | `/api/usuarios/:id`                     | Exclui um usuário             |
| GET    | `/api/eventos`                          | Lista eventos                 |
| GET    | `/api/eventos/:id`                      | Busca um evento               |
| POST   | `/api/eventos`                          | Cadastra um evento            |
| PUT    | `/api/eventos/:id`                      | Atualiza um evento            |
| DELETE | `/api/eventos/:id`                      | Exclui um evento              |
| POST   | `/api/eventos/:id/presencas`            | Marca presença (`usuarioId`)  |
| DELETE | `/api/eventos/:id/presencas/:usuarioId` | Cancela presença              |

Ao marcar presença, o evento perde uma vaga; ao cancelar, a vaga volta.

## Scripts

| Comando             | Descrição                                   |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Servidor em modo desenvolvimento            |
| `pnpm build`        | Compila o TypeScript para `dist/`           |
| `pnpm start`        | Executa a versão compilada                  |
| `pnpm lint`         | Analisa o código com o ESLint               |
| `pnpm format`       | Formata o código com o Prettier             |
| `pnpm type-check`   | Verifica os tipos                           |
| `pnpm db:migrate`   | Cria as tabelas no banco                    |
