import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceResolver } from './place.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [PlaceResolver, PlaceService],
  imports: [DatabaseModule],
})
export class PlaceModule {}
