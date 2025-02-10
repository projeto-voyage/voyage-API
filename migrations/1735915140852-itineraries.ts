import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItineraryMigration1678901234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        destination VARCHAR(255) NOT NULL,
        totalCost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        totalDays INT NOT NULL,
        content JSONB NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS itineraries;
    `);
  }
}
