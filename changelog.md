---

# Changelog

Todas as mudanças notáveis deste projeto serão documentadas aqui. Este arquivo segue o formato [Keep a Changelog](https://keepachangelog.com/) e respeita a versão [Semantic Versioning](https://semver.org/).

## [Unreleased]
- Adicione aqui as mudanças planejadas ou em andamento.

## [1.1.0] - 2024-12-18
### Added
- Criada migration para a entidade `User` com suporte a banco de dados PostgreSQL.
- Comandos configurados no `package.json` para gerenciamento de migrations com TypeORM:
  - **`typeorm:create-migration`**: Cria uma nova migration.  
    ```bash
    npm run typeorm:create-migration --name=MigrationName
    ```
  - **`typeorm:run-migrations`**: Executa as migrations pendentes.  
    ```bash
    npm run typeorm:run-migrations
    ```
  - **`typeorm:revert-migrations`**: Reverte a última migration aplicada.  
    ```bash
    npm run typeorm:revert-migrations
    ```

### Changed
- Arquivo de configuração `typeOrm.config.ts` atualizado para usar variáveis de ambiente no contexto Docker.

### Fixed
- Corrigida configuração incorreta do timestamp na tabela `users`.

---

## [1.0.0] - 2024-12-13
### Added
- Entidade `User` criada com validações usando `class-validator` no DTO.
- Método para geração de IDs aleatórios implementado, utilizando `randomUUID` do módulo `crypto` do Node.js.

---

## Formato de Versão
Usamos **Semantic Versioning**:
- **Major (X.0.0)**: Mudanças que quebram compatibilidade.
- **Minor (0.X.0)**: Funcionalidades novas, compatíveis com versões anteriores.
- **Patch (0.0.X)**: Correções de bugs ou melhorias menores.
