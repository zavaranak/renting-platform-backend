// import { DataSource, DataSourceOptions } from 'typeorm';
// import { config } from 'dotenv';
// import { ConfigService } from '@nestjs/config';
// import { Tenant } from 'src/tenant/tenant.entity';
// import { Booking } from 'src/booking/booking.entity';
// import { Landlord } from 'src/landlord/landlord.entity';
// import { Place } from 'src/place/place.entity';

// config({
//   path: '.env.development',
// });

// const configService = new ConfigService({});
// export const postgresDataSourceOptions: DataSourceOptions = {
//   name: 'DB_Postgresql',
//   type: 'postgres',
//   host: configService.get<string>('DB_HOST'),
//   port: configService.get<number>('DB_PORT'),
//   username: configService.get<string>('DB_USERNAME'),
//   password: configService.get<string>('DB_PASSWORD'),
//   database: configService.get<string>('DB_DATABASE'),
//   entities: ['dist/**/*.{model,entity}{.ts,.js}'],
//   migrations: ['dist/database/migrations/*{.ts,.js}'],
//   synchronize: true,
// };

// export const databaseProviders = [
//   {
//     provide: 'DATA_SOURCE_PSQL',
//     useFactory: async () => {
//       const dataSource = new DataSource({
//         name: 'DB_Postgresql',
//         type: 'postgres',
//         host: configService.get<string>('DB_HOST'),
//         port: configService.get<number>('DB_PORT'),
//         username: configService.get<string>('DB_USERNAME'),
//         password: configService.get<string>('DB_PASSWORD'),
//         database: configService.get<string>('DB_DATABASE'),
//         entities: [Tenant, Booking, Landlord, Place],
//         migrations: ['dist/database/migrations/*{.ts,.js}'],
//         synchronize: true,
//       });
//       return dataSource.initialize();
//     },
//   },
// ];

// const dataSource = new DataSource(postgresDataSourceOptions);
// export default dataSource;
