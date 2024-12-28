
---

# Modelo de Autenticação com JWT

Neste arquivo, explicaremos como funciona o modelo de autenticação na nossa aplicação, que utiliza **JSON Web Token (JWT)**. O JWT é uma forma de garantir a identidade do usuário através de um token assinado digitalmente, que serve como prova de que o usuário está autenticado. Esse token pode ser passado em requisições subsequentes para validar a autenticidade do usuário.

## Como Funciona o JWT

Ao realizar o login, o usuário recebe um **token JWT**. Esse token contém uma **assinatura digital** que valida a autenticidade do usuário, permitindo que ele acesse rotas protegidas na aplicação.

O JWT tem um **tempo de expiração** configurável, que é, por padrão, de **2 dias**. Após esse período, o usuário precisará realizar o login novamente para obter um novo token.

### O que é um Token JWT?

O JWT é um padrão aberto (RFC 7519) que define uma forma compacta e segura de transmitir informações entre partes como um objeto JSON. Ele é assinado digitalmente e pode ser verificado de forma independente pela aplicação para garantir que não foi alterado.

O JWT é composto por 3 partes:

1. **Header**: Contém o tipo do token (JWT) e o algoritmo de assinatura (geralmente `HS256`).
2. **Payload**: Contém as informações (claims) que são transmitidas no token, como dados do usuário.
3. **Signature**: A assinatura digital que valida que o token não foi alterado.

### Como Funciona o Guard no NestJS?

Em vez de utilizar um middleware tradicional para proteger as rotas, o NestJS oferece uma solução mais elegante chamada **Guard**. O Guard é uma forma de proteger rotas específicas da aplicação, garantindo que apenas usuários autenticados possam acessá-las. Ele atua como uma camada de segurança, verificando o token JWT em cada requisição.

O Guard verifica se a requisição contém um token válido e se o usuário está autenticado antes de permitir o acesso à rota.

> Para mais detalhes sobre como usar Guards no NestJS, consulte a [documentação oficial do NestJS](https://docs.nestjs.com/).

### Como Gerar o Token JWT?

A geração do token é feita utilizando uma **chave secreta**, que é definida no arquivo `.env` da aplicação. Essa chave é utilizada para assinar o token e garantir que ele não seja alterado.

A assinatura do token é realizada com as informações fornecidas pelo usuário durante o login. O payload do JWT pode conter dados como:

- **id**: Identificador único do usuário.
- **email**: E-mail do usuário.
- **role**: O papel do usuário (se houver).

### Exemplo de Login e Geração de Token

Ao realizar o login, o usuário envia um **email** e **senha** para a aplicação. Se as credenciais forem válidas, o servidor gera e envia o token JWT de volta.

#### Requisição de Login

**Método**: `POST`

**URL**: `http://localhost:3000/auth/signIn`

**Corpo da Requisição** (JSON):

```json
{
  "email": "hemanoel718@example.com",
  "password": "pass@2010"
}
```

#### Resposta de Sucesso

Se as credenciais forem válidas, a resposta incluirá o token JWT gerado.

**Exemplo de Resposta** (JSON):

```json
{
  "access_token": "jwt_token_aqui"
}
```

### Como Utilizar o Token JWT nas Requisições

Após o login bem-sucedido e a obtenção do token JWT, você deve incluí-lo no cabeçalho das requisições subsequentes para acessar rotas protegidas.

Por exemplo, ao realizar uma requisição GET para uma rota protegida, você precisa passar o token no cabeçalho `Authorization`:

#### Exemplo com **cURL**:

```bash
curl -X GET http://localhost:3000/protected-route \
-H "Authorization: Bearer jwt_token_aqui"
```

#### Exemplo com **Postman/Insomnia**:

1. Selecione o método de requisição (GET, POST, etc.).
2. No cabeçalho, adicione a chave `Authorization` com o valor `Bearer jwt_token_aqui`.
3. Envie a requisição.

O Guard irá verificar o token fornecido e, caso seja válido e não expirado, permitirá o acesso à rota solicitada.

---

## Expiração do Token

O JWT tem um período de expiração configurado, que, por padrão, é de **2 dias**. Após esse período, o token expirará e o usuário precisará fazer login novamente para obter um novo token.

> **Nota**: O tempo de expiração pode ser alterado conforme a necessidade, editando o valor no arquivo `.env`.

---

## Links Úteis

- [Documentação de Endpoints](./endpoints.md) — Para mais detalhes sobre como fazer requisições de login e outros endpoints.
- [Documentação do NestJS sobre Guards](https://docs.nestjs.com/) — Para aprender mais sobre como os Guards funcionam no NestJS.

---

### Observações Finais

Este modelo de autenticação com JWT permite que a aplicação proteja rotas de forma eficiente, garantindo que apenas usuários autenticados possam acessar recursos sensíveis. O uso de Guards no NestJS proporciona uma abordagem mais modular e flexível para segurança, em vez de depender de middleware.

Conforme a aplicação cresce, novos endpoints de autenticação e segurança serão adicionados. Certifique-se de sempre verificar a documentação atualizada e seguir as melhores práticas para a segurança da sua aplicação.

---