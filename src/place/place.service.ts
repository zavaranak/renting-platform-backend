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
import { PlaceUpdateInput } from './dto/update_place.dto';

@Injectable()
export class PlaceService {
  private placeRepository: Repository<Place>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private datasource: DataSource,
    private landlordService: LandlordService,
  ) {
    this.placeRepository = this.datasource.getRepository(Place);
  }

  async findAll(relations: string[]): Promise<Place[]> {
    try {
      const places = await this.placeRepository.find({
        relations: relations,
      });
      console.log(places);
      return places;
    } catch (error) {
      console.error('An errror occurred while finding all Places: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occured while findind all Places',
      );
    }
  }
  async findOneById(id: string, relations: string[]): Promise<Place> {
    try {
      return await this.placeRepository.findOne({
        where: { id },
        relations: relations,
      });
    } catch (error) {
      console.error('An errror occurred while finding place by id: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occured while findind place by id',
      );
    }
  }

  async createOne(placeInput: PlaceInput): Promise<PlaceResponse> {
    try {
      const landlord = await this.landlordService.findOneById(
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

  async updateOne(placeUpdateInput: PlaceUpdateInput) {
    const place = await this.findOneById(placeUpdateInput.id, []);
    try {
      for (const [key, value] of Object.entries(placeUpdateInput)) {
        if (key === 'id') continue;
        place[key] = value;
      }
      console.log(place);
      const updatedPlace = await this.placeRepository.save({ ...place });
      return { place: updatedPlace, message: 'Updated place' };
    } catch (error) {
      console.error(
        `An error occurred while updating place ${placeUpdateInput.id}`,
      );
    }
  }

  async deleteOne() {}
}
