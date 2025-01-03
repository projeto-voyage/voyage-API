import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const conf = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: conf.get('DB_HOST'),
  port: conf.get('DB_PORT'),
  username: conf.get('DB_USERNAME'),
  password: conf.get('DB_PASSWORD'),
  database: conf.get('DB_DATABASE'),
  migrations: ['migrations/**'],
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  logging: true,
});
