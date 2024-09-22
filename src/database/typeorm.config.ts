// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export default function (): TypeOrmModuleOptions {
//   return {
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     entities: ['dist/**/*.{model,entity}{.ts,.js}'],
//     migrations: ['src/database/migrations/*{.ts,.js}'],
//     // synchronize: process.env.DB_SYNCHRONIZE === 'true',
//     synchronize: true,
//     logging: true,
//   };
// }

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataSourceOptions } from './datasource';

export default function (): TypeOrmModuleOptions {
  return {
    ...dataSourceOptions,
    autoLoadEntities: true,
  };
}
