# BUILD instala tudo e compila o TS
FROM node:24-alpine AS build

WORKDIR /app

# instala o pnpm 
RUN npm install -g pnpm@11

# Copia só os arquivos de dependências
# se não mudar, docker reaproveita etapa do cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# copia o restante do código e gera dist/
COPY . .
RUN pnpm build

# PRODUCAO só o que precisa pra rodar a api
FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm@11

# instala só dependências de produção
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# copia da etapa 1 o código já compilado
COPY --from=build /app/dist ./dist

# copia os arquivos usados pelas migrations
COPY .sequelizerc ./
COPY src/config/config.cjs ./src/config/config.cjs
COPY src/migrations ./src/migrations

EXPOSE 3000

# inicializar containers - cria as tabelas e sobe a api
CMD ["sh", "-c", "pnpm db:migrate && node dist/server.js"]