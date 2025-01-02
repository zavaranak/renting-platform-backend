import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationResolver } from './notification.resolver';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
