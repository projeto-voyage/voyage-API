
---

# Endpoints da Aplicação

Este arquivo documenta as principais rotas (endpoints) da aplicação, explicando como conectar e interagir com a API para realizar operações como criação, busca e login de usuários.

## Como Testar as Rotas

Para testar os endpoints da aplicação, você pode usar ferramentas de requisições, como:

- **Postman**
- **Insomnia**
- **cURL**

Essas ferramentas permitem enviar requisições HTTP de maneira fácil e interagir com a API sem a necessidade de uma interface frontend.

### Configuração Inicial

Antes de fazer as requisições, certifique-se de que a aplicação está rodando e acessível. O endereço base para os endpoints será:

```
http://localhost:3000
```

> **Nota**: A porta `3000` pode ser configurada no arquivo `.env` do projeto, então ela pode ser alterada se necessário.

Agora, com o servidor rodando, você pode testar as rotas da API.

---

## Endpoints de Usuário

Abaixo estão as rotas relacionadas à gestão de usuários. Estas permitem a criação, busca e manipulação de dados dos usuários na aplicação.

### 1. Criar um Novo Usuário (POST)

**URL**: `http://localhost:3000/users/`

**Descrição**: Cria um novo usuário na aplicação.

**Exemplo de Corpo da Requisição** (JSON):

```json
{
  "name": "Emanoel",
  "email": "hemanoel718@example.com",
  "password": "pass@2010"
}
```

**Método HTTP**: `POST`

---

### 2. Buscar Todos os Usuários (GET)

**URL**: `http://localhost:3000/users/`

**Descrição**: Recupera todos os usuários cadastrados na aplicação.

**Método HTTP**: `GET`

---

### 3. Buscar um Usuário Específico (GET)

**URL**: `http://localhost:3000/users/{id}`

**Descrição**: Recupera as informações de um usuário específico, fornecendo o `id` como parâmetro.

**Exemplo de URL**:

```bash
http://localhost:3000/users/1
```

**Método HTTP**: `GET`

> **Nota**: Substitua `{id}` pelo ID real do usuário.

---

## Endpoints de Autenticação

Além dos endpoints de usuário, temos rotas específicas para login (autenticação) e gerenciamento de sessões.

### 1. Login do Usuário (POST)

**URL**: `http://localhost:3000/auth/signIn`

**Descrição**: Realiza o login do usuário, fornecendo credenciais (email e senha).

**Exemplo de Corpo da Requisição** (JSON):

```json
{
  "email": "hemanoel718@example.com",
  "password": "pass@2010"
}
```

**Método HTTP**: `POST`

---

## Como Adicionar Novos Endpoints

À medida que a aplicação evolui, novos endpoints serão adicionados a este arquivo. Fique atento a futuras atualizações.

---

### Observações Finais

- **Autenticação**: Para acessar alguns endpoints, pode ser necessário incluir um token de autenticação nos cabeçalhos das requisições. Detalhes sobre como obter esse token estarão disponíveis na documentação de autenticação.
  
- **Testes**: Se você estiver utilizando o Postman, Insomnia ou cURL, lembre-se de configurar corretamente os cabeçalhos e o corpo da requisição de acordo com a operação que deseja realizar.

---

## Links Úteis

- [Documentação de Autenticação](./auth.md) — Para mais detalhes sobre como funciona o login e rotas protegidas.

---

### Exemplo de Uso com cURL

Aqui estão alguns exemplos de como você pode testar os endpoints utilizando **cURL** no terminal:

- **Criar um Usuário**:

```bash
curl -X POST http://localhost:3000/users/ \
-H "Content-Type: application/json" \
-d '{"name": "Emanoel", "email": "hemanoel718@example.com", "password": "pass@2010"}'
```

- **Buscar Todos os Usuários**:

```bash
curl http://localhost:3000/users/
```

- **Buscar um Usuário Específico**:

```bash
curl http://localhost:3000/users/1
```

- **Login de Usuário**:

```bash
curl -X POST http://localhost:3000/auth/signIn \
-H "Content-Type: application/json" \
-d '{"email": "hemanoel718@example.com", "password": "pass@2010"}'
```

---

### Conclusão

Esta documentação serve como guia para entender como interagir com a API da aplicação. Use as ferramentas mencionadas para enviar requisições aos endpoints e testar as funcionalidades. A medida que a aplicação cresce, novos endpoints serão adicionados, e a documentação será atualizada para refletir essas mudanças.

---
