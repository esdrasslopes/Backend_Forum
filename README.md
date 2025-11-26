# 🗃️ Fórum Clean Architecture API (NestJS)

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E941C?style=for-the-badge&logo=vitest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

<p align="center">
 <a href="#-sobre-o-projeto">Sobre</a> •
 <a href="#-funcionalidades">Funcionalidades</a> •
 <a href="#-tecnologias-utilizadas">Tecnologias</a> •
 <a href="#-como-executar">Como Executar</a> •
 <a href="#-testes">Testes</a> •
 <a href="#-licença">Licença</a>
</p>

---

## 📖 Sobre o Projeto

Este projeto é uma API de **Fórum de Perguntas e Respostas** construída com **NestJS** e **Clean Architecture**. O objetivo é fornecer uma base robusta, escalável e testável para aplicações de fórum, separando claramente as regras de negócio das camadas de infraestrutura.

O backend utiliza **PostgreSQL** (via Prisma) para persistência e **Redis** para cache, ambos orquestrados com **Docker Compose**. O projeto foi aprimorado em relação ao README padrão gerado pelo esqueleto inicial, trazendo mais clareza e detalhes sobre o domínio de fórum.

---

## 🎯 Funcionalidades

A API permite:

- Cadastro e autenticação de usuários (JWT)
- Criação, listagem e resposta de perguntas
- Comentários em perguntas e respostas
- Sistema de notificações para interações relevantes
- Upload de anexos (com suporte a AWS S3)
- Cache de dados com Redis para performance

### Principais Endpoints

| Método | Endpoint                          | Descrição                                    |
| :----- | :-------------------------------- | :------------------------------------------- |
| `POST` | `/accounts`                       | Criação de novo usuário                      |
| `POST` | `/sessions`                       | Autenticação e geração de token JWT          |
| `POST` | `/questions`                      | Criação de nova pergunta (autenticado)       |
| `GET`  | `/questions`                      | Listagem de perguntas recentes (autenticado) |
| `POST` | `/questions/:questionId/answers`  | Responder uma pergunta                       |
| `GET`  | `/questions/:questionId/answers`  | Listar respostas de uma pergunta             |
| `POST` | `/questions/:questionId/comments` | Comentar em uma pergunta                     |
| `POST` | `/answers/:answerId/comments`     | Comentar em uma resposta                     |

> Exemplos completos no arquivo `client.http` (compatível com Thunder Client/REST Client no VS Code).

---

## ✨ Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript
- **NestJS** — Framework backend modular e escalável
- **TypeScript** — Tipagem estática para JavaScript
- **PostgreSQL** — Banco de dados relacional
- **Redis** — Cache em memória
- **Prisma** — ORM para PostgreSQL
- **Zod** — Validação de schemas
- **Vitest** — Testes unitários e E2E
- **Docker & Docker Compose** — Orquestração de containers
- **Bcryptjs** — Criptografia de senhas
- **AWS SDK S3** — Upload de arquivos
- **ESLint** — Linting e padronização de código

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js v18+
- pnpm (ou npm)
- Docker e Docker Compose

### Passos

1. Instale as dependências:

   ```bash
   pnpm install
   # ou
   npm install
   ```

2. Inicie os serviços de banco e cache:

   ```bash
   docker-compose up -d
   ```

3. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

4. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie a aplicação em modo desenvolvimento:
   ```bash
   npm run start:dev
   ```

---

## 🧪 Testes

Execute os testes unitários e E2E com:

```bash
pnpm test
# ou
pnpm vitest --config vitest.config.e2e.ts
```
