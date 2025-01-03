import { MigrationInterface, QueryRunner } from 'typeorm';

export class Trips1735913041249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE trips (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        userId UUID NOT NULL,
        destination VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        budget DECIMAL(10, 2) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE trips;`);
  }
}
