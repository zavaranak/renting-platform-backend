import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from 'src/tenant/tenant.entity';
import { Landlord } from 'src/landlord/landlord.entity';
import { Place } from 'src/place/place.entity';
import { TenantAttribute } from 'src/tenant/tenant_attribute.entity';
import { LandlordAttribute } from 'src/landlord/landlord_attribute.entity';
import { PlaceAttribute } from 'src/place/place_attribute.entity';
import { BookingReview } from 'src/booking/booking_review/booking_review.entity';
import { Notification } from 'src/notifcation/notification.entity';
import { ActiveBooking } from '@booking/active_booking/active-booking.entity';
import { PendingBooking } from '@booking/pending_booking/pending-booking.entity';
import { CompletedBooking } from '@booking/completed_booking/completed-booking.entity';

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
          ActiveBooking,
          PendingBooking,
          CompletedBooking,
          Landlord,
          Place,
          TenantAttribute,
          LandlordAttribute,
          PlaceAttribute,
          BookingReview,
          Notification,
        ],
        migrations: ['dist/database/migrations/*{.ts,.js}'],
        synchronize: true,
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
