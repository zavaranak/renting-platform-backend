import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { BookingModule } from './booking/booking.module';
import { PlaceModule } from './place/place.module';
import { LandlordModule } from './landlord/landlord.module';
import 'dotenv/config';
import { DatabaseModule } from './database/database.module';
import { AppGateway } from './app.gateway';
import { NotificationService } from './notifcation/notification.service';

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
    DatabaseModule,
    AuthModule,
    TenantModule,
    BookingModule,
    PlaceModule,
    LandlordModule,
  ],
  providers: [AppGateway, NotificationService],
})
export class AppModule {}
