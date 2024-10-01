import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config({
  path: '.env.development',
});

const configService = new ConfigService({});
export const postgresDataSourceOptions: DataSourceOptions = {
  name: 'DB_Postgresql',
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: ['dist/**/*.{model,entity}{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: true,
};

const dataSource = new DataSource(postgresDataSourceOptions);
export default dataSource;
