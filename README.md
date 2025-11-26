# 🗃️ NestJS Clean Architecture API

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
 <a href="#-funcionalidades">Endpoints Principais</a> •
 <a href="#-tecnologias-utilizadas">Tecnologias</a> •
 <a href="#-começando">Começando</a> •
 <a href="#-executando-os-testes">Testes</a> •
 <a href="#-licença">Licença</a>
</p>

---

## 📖 Sobre o Projeto

Este projeto é um esqueleto de aplicação **backend** construído em **NestJS** com foco em **Clean Architecture**. Ele foi projetado para ser robusto, testável e escalável, separando claramente as regras de negócio das camadas de infraestrutura. Utiliza **PostgreSQL** para persistência de dados (via Prisma) e **Redis** como cache, ambos orquestrados via **Docker Compose**.

A estrutura do projeto sugere um ponto de entrada customizado (`infra/main.ts` conforme `nest-cli.json`), reforçando a abordagem de arquitetura limpa (Clean Architecture).

---

## 🎯 Endpoints Principais

Com base no arquivo `client.http`, estes são alguns dos principais endpoints que a API oferece:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/accounts` | Criação de um **novo usuário/conta**. |
| `POST` | `/sessions` | **Autenticação** de usuário e geração de token JWT. |
| `POST` | `/questions` | Criação de uma **nova pergunta** (requer autenticação). |
| `GET` | `/questions` | Busca por **perguntas recentes** (requer autenticação). |

> **Nota:** O arquivo `client.http` contém exemplos prontos para serem executados em extensões como a **Thunder Client** ou **REST Client** no VS Code.

---

## ✨ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

### Linguagens e Frameworks
* **[Node.js](https://nodejs.org/en/)**: Ambiente de execução JavaScript.
* **[NestJS](https://nestjs.com/)**: Framework para construção de aplicações backend escaláveis e eficientes.
* **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.

### Banco de Dados e Cache
* **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional robusto.
* **[Redis](https://redis.io/)**: Servidor de estrutura de dados em memória, usado como cache (`ioredis`).
* **[Prisma](https://www.prisma.io/)**: ORM que simplifica a comunicação com o PostgreSQL.

### Ferramentas e Utilitários
* [cite_start]**[Docker](https://www.docker.com/)**: Para orquestração e isolamento dos serviços de banco de dados e cache[cite: 2].
* **[Zod](https://zod.dev/)**: Biblioteca de validação de esquemas (schema validation) e tipagem.
* **[Vitest](https://vitest.dev/)**: Framework de testes rápido e moderno para testes unitários/E2E.
* **[Bcryptjs](https://github.com/dcodeIO/bcrypt.js)**: Para criptografia de senhas.
* **AWS SDK S3**: Para manipulação de arquivos na nuvem (incluso nas dependências, `client-s3`).
* **ESLint**: Para padronização e linting de código.

---

## 🚀 Começando

Siga os passos abaixo para colocar o projeto em funcionamento na sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* **[Node.js](https://nodejs.org/en/)** (Recomendado v18+).
* **[pnpm](https://pnpm.io/)** ou **[npm](https://www.npmjs.com/)** (O projeto usa `pnpm-lock.yaml`, então `pnpm` é sugerido, mas `npm` também funciona).
* **[Docker](https://www.docker.com/products/docker-desktop/)** e **[Docker Compose](https://docs.docker.com/compose/install/)**.

### Instalação e Configuração

1.  **Instale as dependências**:
    ```bash
    pnpm install
    # ou
    npm install
    ```

2.  **Inicie os serviços com Docker Compose**:
    [cite_start]O arquivo `docker-compose.yml` [cite: 2] inicia o PostgreSQL e o Redis:
    ```bash
    docker-compose up -d
    ```
    * [cite_start]O **PostgreSQL** ficará acessível na porta `5433`[cite: 2].
    * [cite_start]O **Redis** (cache) ficará acessível na porta `6379`[cite: 2].

3.  **Configure as variáveis de ambiente**:
    Crie seu arquivo `.env` (a partir de um modelo se houver, ou crie manualmente):
    ```bash
    cp .env.example .env # Se você tiver um .env.example
    ```
    [cite_start]*As configurações padrão para o banco (usuário: `postgres`, senha: `docker`, db: `nest-clean`) [cite: 2] [cite_start]e para o Redis (portas `5433` e `6379` respectivamente) [cite: 2] já estão definidas no `docker-compose.yml`.*

4.  **Execute as migrações do Prisma**:
    Este comando irá aplicar o schema no seu banco de dados:
    ```bash
    npx prisma migrate dev
    ```

### Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento com *hot-reload*:

```bash
npm run start:dev
