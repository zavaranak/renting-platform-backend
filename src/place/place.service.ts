import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Place } from './place.entity';
import { PlaceInput } from './dto/create-place.dto';
import { LandlordService } from 'src/landlord/landlord.service';
import { PlaceResponse } from './dto/place_response';

@Injectable()
export class PlaceService {
  private placeRepository: Repository<Place>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private datasource: DataSource,
    private landlordService: LandlordService,
  ) {
    this.placeRepository = this.datasource.getRepository(Place);
  }

  async createOne(placeInput: PlaceInput): Promise<PlaceResponse> {
    try {
      const landlord = await this.landlordService.findById(
        placeInput.landlordId,
      );

      const currentTime = Date.now();
      const place = {
        name: placeInput.name,
        address: placeInput.address,
        city: placeInput.city,
        type: placeInput.type,
        area: placeInput.area,
        price: placeInput.price,
        landlord: landlord,
        createdAt: currentTime,
        lastUpdate: currentTime,
      };
      const newPlace = await this.placeRepository.save(place);
      return { place: newPlace, message: '' };
    } catch (err) {
      return { place: null, message: err };
    }
  }

  async updateOne() {}

  async deleteOne() {}
}
