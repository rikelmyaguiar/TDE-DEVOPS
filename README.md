# Microservices com Docker

Este projeto demonstra uma aplicação simples baseada em microserviços utilizando Docker Compose.

A aplicação é composta por uma API em Node.js, um banco de dados MySQL e um frontend servido com Nginx.

## Serviços

- api_service  -> API Node.js (porta 3000)
- mysql_db     -> Banco de dados MySQL
- web_service  -> Frontend (Nginx - porta 8080)

## Pré-requisitos

- Docker
- Docker Compose

## Como executar

Clone o repositório:

git clone <URL_DO_REPOSITORIO>
cd nome-do-projeto

Execute os containers:

docker compose up --build

Aguarde até aparecer no terminal:

API rodando em http://localhost:3000
Conectado ao MySQL

## Acesso

Frontend:
http://localhost:8080

API:
http://localhost:3000/users

## Endpoints

GET /users  
Lista todos os usuários

POST /users  
Cria um novo usuário

Exemplo de requisição:

{
  "name": "João",
  "email": "joao@email.com"
}

## Banco de dados

Banco: devops_db

Acessar via terminal:

docker exec -it mysql_db mysql -u root -proot123

Comandos:

USE devops_db;
SELECT * FROM users;

## Observações

- O banco de dados é criado automaticamente
- A API aguarda o MySQL iniciar
- Os dados são persistidos em volume Docker

## Autor

Adriano Rikelmy Aguiar da Silva - 5° Período
TDE Pratica DevOps — Professor: Marcos Gomes da Silva Rocha
