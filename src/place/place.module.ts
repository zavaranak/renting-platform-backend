import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceResolver } from './place.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { LandlordModule } from 'src/landlord/landlord.module';

@Module({
  providers: [PlaceResolver, PlaceService],
  imports: [DatabaseModule, LandlordModule],
  exports: [PlaceService],
})
export class PlaceModule {}
