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
import { PlaceAttributeNames } from 'src/common/constants';
import { PlaceAttribute } from './place_attribute.entity';
import { queryMany, QueryParams, queryOne } from 'src/common/query_function';

@Injectable()
export class PlaceService {
  private placeRepository: Repository<Place>;
  private placeAttributeRepository: Repository<PlaceAttribute>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private datasource: DataSource,
    private landlordService: LandlordService,
  ) {
    this.placeRepository = this.datasource.getRepository(Place);
  }

  async getMany(queryParams: QueryParams): Promise<Place[]> {
    return await queryMany(this.placeRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Place> {
    return await queryOne(this.placeRepository, queryParams);
  }

  async createOne(placeInput: PlaceInput): Promise<PlaceResponse> {
    try {
      const landlord = await this.landlordService.getOne({
        queryValue: placeInput.landlordId,
        queryType: 'id',
      });

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
    const place = await this.getOne({
      queryValue: placeUpdateInput.id,
      queryType: 'id',
    });
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating place',
      );
    }
  }

  async addAttribute(
    placeId: string,
    name: PlaceAttributeNames,
    value: any,
  ): Promise<PlaceAttribute> {
    try {
      const place = await this.getOne({ queryValue: placeId, queryType: 'id' });
      const newAttribute: PlaceAttribute = {
        name: name,
        value: value.toString,
        place: place,
      };
      return await this.placeAttributeRepository.save(newAttribute);
    } catch (error) {
      console.error('An error occurred while adding attribute to place');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while adding attribute to place',
      );
    }
  }

  async deleteOne() {}
}
