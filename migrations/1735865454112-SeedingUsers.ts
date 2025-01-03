import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertDevUser1673456442239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('desenvolve123', 12);  // Encriptando a senha

    await queryRunner.manager.insert('users', {
      id: 'uuid_generate_v4()',
      name: 'Dev',
      email: 'dev@example.com',
      password: hashedPassword,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('users', { email: 'dev@example.com' });
  }
}
