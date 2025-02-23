import { Module } from '@nestjs/common';
import ProfileService from './profile.service';
import { DatabaseModule } from 'src/database/database.module';

import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
