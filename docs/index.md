
---

# Documentação do Processo de Desenvolvimento da API

Este diretório e os arquivos contidos nele têm como objetivo detalhar o processo de desenvolvimento da nossa API. O foco é proporcionar uma visão clara e técnica sobre o que foi feito, o que está em andamento e como configurar o ambiente de desenvolvimento local. Este documento vai além do tradicional `README.md`, que geralmente é utilizado para apresentar a ideia geral de uma aplicação, focando nos aspectos técnicos e operacionais do desenvolvimento.

## Stack de Desenvolvimento

A stack de tecnologias utilizadas para o desenvolvimento da nossa aplicação é composta pelas seguintes ferramentas:

- **Docker**: Usado para gerar um container Docker com uma imagem do PostgreSQL, além de outras configurações essenciais para a aplicação.
- **PostgreSQL**: Optamos por um banco de dados relacional devido à necessidade de suportar múltiplos relacionamentos complexos.
- **NestJS**: Framework utilizado para o desenvolvimento do backend. O NestJS foi escolhido por ser robusto, flexível e adequado para a criação de aplicações escaláveis e de alta performance.
- **TypeORM**: Utilizado para a manipulação de dados no banco de dados. O TypeORM oferece suporte a diversos bancos de dados relacionais, facilitando o trabalho com migrations e interações com o banco.

## Como Iniciar a Aplicação

Para configurar e iniciar a aplicação no seu ambiente local, siga os passos abaixo:

### 1. Baixar o Repositório

Você pode baixar o repositório de duas formas:

- **Via .zip**.
- **Ou utilizando o comando Git**:

```bash
git clone https://github.com/projeto-voyage/voyage-API.git
```

### 2. Instalar Dependências

Após baixar o repositório, instale as dependências necessárias com o seguinte comando:

```bash
npm install
```

### 3. Configurar o Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias. As informações específicas para configuração (como credenciais de banco de dados, chaves secretas, etc.) podem ser obtidas nas ferramentas de controle utilizadas pela equipe ou fornecidas pelo time de desenvolvimento.

### 4. Subir o Docker

Para subir o container com o PostgreSQL, execute o seguinte comando:

```bash
docker-compose up -d
```

Este comando irá gerar a imagem do banco de dados e rodar os containers necessários para a aplicação.

### 5. Executar as Migrations

Para versionar as tabelas do banco de dados e garantir que todas as mudanças no esquema sejam aplicadas corretamente, use os seguintes comandos:

#### Como Rodar as Migrations com `npm run`

##### 1. Criar uma Nova Migration

Para criar uma nova migration, execute o seguinte comando:

```bash
npm run typeorm:create-migration -- NomeDaMigration
```

- **NomeDaMigration**: Substitua `NomeDaMigration` pelo nome que faça sentido para a sua migration.

##### 2. Rodar as Migrations

Para rodar todas as migrations pendentes, use:

```bash
npm run typeorm:run-migrations
```

Este comando vai aplicar todas as migrations que ainda não foram aplicadas ao banco de dados.

##### 3. Reverter a Última Migration

Se você precisar reverter a última migration, utilize:

```bash
npm run typeorm:revert-migrations
```

Esse comando irá desfazer a última migration executada.

> **Importante**: Estes são os comandos principais para trabalhar com migrations. A documentação será atualizada conforme novas operações forem adicionadas ou modificadas.

### 6. Iniciar a Aplicação

Após rodar as migrations e garantir que tudo está configurado corretamente, você pode iniciar a aplicação em modo de desenvolvimento ou produção.

- Para iniciar em **modo de desenvolvimento**, execute:

  ```bash
  npm run start:dev
  ```

  Ou, caso tenha o NestJS CLI instalado:

  ```bash
  nest start
  ```

- Para rodar a aplicação em **modo de produção**, utilize:

  ```bash
  npm run start
  ```

### 7. Consultar os Endpoints

Após configurar o ambiente e rodar a aplicação, você pode consultar os **endpoints** disponíveis para interagir com a API. A documentação dos endpoints está disponível no arquivo de [**rotas da aplicação**](./endpoints.md).

---

## Observações Finais

Esta documentação tem como objetivo proporcionar uma visão mais clara sobre o processo de desenvolvimento da API e como configurar o ambiente local de forma eficiente. Caso surjam dúvidas ou seja necessário atualizar alguma informação, sinta-se à vontade para contribuir ou abrir uma *issue* no repositório.

---

### Melhorias Implementadas:

1. **Organização dos Tópicos**: Dividi algumas seções para garantir uma leitura mais fluida e lógica (exemplo: "Como Iniciar a Aplicação" agora está mais detalhada).
   
2. **Melhoria na Explicação**: Ajustei o texto de alguns tópicos para melhorar a clareza e fluidez, mantendo a explicação simples e objetiva.

3. **Correções de Formatação**: Fiz algumas correções menores de formatação para garantir que a documentação fique mais legível, como a estruturação de listas e chamadas de comando.

---