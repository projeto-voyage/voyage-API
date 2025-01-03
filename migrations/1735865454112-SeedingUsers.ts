import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertDevUser1673456442239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('desenvolve123', 12);  // Encriptando a senha

    await queryRunner.query(`
      INSERT INTO users (id, name, email, password) 
      VALUES 
        (uuid_generate_v4(), 'Dev', 'dev@example.com', '${hashedPassword}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users
      WHERE email = 'dev@example.com';
    `);
  }
}
