import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import {
  LandlordAttributeName,
  ActionStatus,
  AttributesStatus,
  UserStatus,
} from 'src/common/constants';
import { LandlordAttribute } from './landlord_attribute.entity';
import { queryMany, queryOne, QueryParams } from 'src/common/query_function';
import * as bcrypt from 'bcrypt';
import { LandlordAttributeInput } from './landlord_attribute_input';
import { QueryResponse } from 'src/common/reponse';

@Injectable()
export class LandlordService {
  private landlordRepository: Repository<Landlord>;
  private landlordAttributeRepository: Repository<LandlordAttribute>;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    this.landlordRepository = this.datasource.getRepository(Landlord);
    this.landlordAttributeRepository =
      this.datasource.getRepository(LandlordAttribute);
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

  async addAttributes(
    landlordId: string,
    attributes: LandlordAttributeInput[],
  ): Promise<QueryResponse> {
    console.log(attributes);
    const landlord = await this.getOne({
      queryValue: landlordId,
      queryType: 'id',
    });
    const newAttributes: LandlordAttribute[] = await Promise.all(
      attributes.map(async (attribute) => {
        const type =
          attribute.name === LandlordAttributeName.BIRTH_DAY
            ? 'date'
            : 'string';
        return {
          name: attribute.name,
          value: attribute.value,
          type: type,
          landlord: landlord,
        };
      }),
    );
    try {
      await this.landlordAttributeRepository.save(newAttributes);

      return {
        message: AttributesStatus.UPDATED,
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.error('An error occurred while adding attribute to landlord');
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while adding attribute to landlord',
      );
    }
  }

  async updateAttribute(id: string, updateValue: string) {
    const target = await this.landlordAttributeRepository.findOneBy({ id: id });
    target.value = updateValue;
    await this.landlordAttributeRepository.save(target);
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'attribute updated',
    };
  }

  async deleteAttribute(id: string) {
    await this.landlordAttributeRepository.delete({ id: id });
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'attribute updated',
    };
  }

  async getMany(queryParams: QueryParams): Promise<Landlord[]> {
    return await queryMany(this.landlordRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Landlord> {
    return await queryOne(this.landlordRepository, queryParams);
  }
}
