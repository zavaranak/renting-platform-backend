import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from 'src/tenant/tenant.entity';
import { Booking } from 'src/booking/booking.entity';
import { Landlord } from 'src/landlord/landlord.entity';
import { Place } from 'src/place/place.entity';
import { TenantAttribute } from 'src/tenant/tenant_attribute.entity';
import { LandlordAttribute } from 'src/landlord/landlord_attribute.entity';
import { PlaceAttribute } from 'src/place/place_attribute.entity';
import { BookingReview } from 'src/booking/booking_review/booking_review.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE_PSQL',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        name: 'DB_Postgresql',
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Tenant,
          Booking,
          Landlord,
          Place,
          TenantAttribute,
          LandlordAttribute,
          PlaceAttribute,
          BookingReview,
        ],
        migrations: ['dist/database/migrations/*{.ts,.js}'],
        synchronize: true,
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
