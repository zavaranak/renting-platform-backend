import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import { LandlordAttributeNames, UserStatus } from 'src/common/constants';
import { LandlordAttribute } from './landlord_attribute.entity';
import { queryMany, queryOne, QueryParams } from 'src/common/query_function';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LandlordService {
  private landlordRepository: Repository<Landlord>;
  private landlordAttributeRepository: Repository<LandlordAttribute>;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    this.landlordRepository = this.datasource.getRepository(Landlord);
  }

  async createOne(username: string, password: string): Promise<Landlord> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newLandlord = {
        username: username,
        password: hashedPassword,
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

  async addAttribute(
    landlordId: string,
    name: LandlordAttributeNames,
    value: any,
  ): Promise<LandlordAttribute> {
    try {
      const type = typeof value;
      const landlord: Landlord = await this.getOne({
        queryValue: landlordId,
        queryType: 'id',
      });
      const newAttribute: LandlordAttribute = {
        landlord: landlord,
        name: name,
        value: value.toString(),
        type: type,
      };
      return await this.landlordAttributeRepository.save(newAttribute);
    } catch (error) {
      console.error('An error occurred while adding attribute to landlord');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while adding attribute to landlord',
      );
    }
  }

  async getMany(queryParams: QueryParams): Promise<Landlord[]> {
    return await queryMany(this.landlordRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Landlord> {
    return await queryOne(this.landlordRepository, queryParams);
  }
}
