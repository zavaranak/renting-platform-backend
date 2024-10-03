import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Place } from './place.entity';
import { PlaceInput } from './dto/create_place.dto';
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

  async findById(id: string): Promise<Place> {
    const place = await this.placeRepository.findOneBy({ id });
    return place;
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
    } catch (error) {
      console.log('An error occurred while creating Place', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Place',
      );
    }
  }

  async updateOne() {}

  async deleteOne() {}
}
