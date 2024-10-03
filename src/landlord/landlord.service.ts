import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import { UserStatus } from 'src/common/constants';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class LandlordService {
  private landlordRepository: Repository<Landlord>;
  private placeService: PlaceService;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    this.landlordRepository = this.datasource.getRepository(Landlord);
  }

  async findAll(): Promise<Landlord[]> {
    try {
      return await this.landlordRepository.find();
    } catch (error) {
      console.error('An error occured while finding all Landlords: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding all Landlords',
      );
    }
  }

  async findOneByUsername(username: string): Promise<Landlord> {
    try {
      return await this.landlordRepository.findOneBy({ username });
    } catch (error) {
      console.error('An error occured while finding Landlord: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Landlord',
      );
    }
  }
  async findOneById(id: string): Promise<Landlord> {
    try {
      return await this.landlordRepository.findOneBy({ id });
    } catch (error) {
      console.log('An error occurred while finding Landlord by Id:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Landlord',
      );
    }
  }

  async createOne(username: string, password: string): Promise<Landlord> {
    try {
      const newLandlord = {
        username: username,
        password: password,
        createdAt: Date.now(),
        status: UserStatus.VERIFIED,
      };
      return await this.landlordRepository.save(newLandlord);
    } catch (error) {
      console.log('An error occurred while creating Landlord:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Landlord',
      );
    }
  }

  // async addPlace(placeInput: PlaceInput, landlordId: string) {
  //   try {
  //     placeInput.landlordId = landlordId;
  //     return await this.placeService.createOne(placeInput);
  //   } catch (error) {
  //     console.log('An error occurred while finding Landlord by Id:', error);
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(
  //       'An error occurred while finding Landlord',
  //     );
  //   }

  // }
}
