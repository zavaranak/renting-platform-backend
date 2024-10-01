import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { typeOrmConfigs } from './database/typeorm.config';
import { BookingModule } from './booking/booking.module';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRoot(typeOrmConfigs[0]),
    AuthModule,
    TenantModule,
    BookingModule,
  ],
  providers: [],
})
export class AppModule {}
