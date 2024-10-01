import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgresDataSourceOptions } from './datasource';

export const typeOrmConfigs: TypeOrmModuleOptions[] = [
  { ...postgresDataSourceOptions, autoLoadEntities: true },
];
