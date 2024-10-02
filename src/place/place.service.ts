import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Place } from './place.entity';

@Injectable()
export class PlaceService {
  private placeRepository: Repository<Place>;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    this.placeRepository = this.datasource.getRepository(Place);
  }
}
