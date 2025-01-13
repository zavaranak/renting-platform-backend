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
import { AttributeUpdateInput } from 'src/common/attribute_update_input';
import { LandlordAttribute } from './landlord_attribute.entity';
import {
  Operator,
  queryDistinct,
  queryMany,
  queryOne,
  QueryParams,
} from 'src/common/query_function';
import * as bcrypt from 'bcrypt';
import { LandlordAttributeInput } from './landlord_attribute_input';
import { QueryResponse } from 'src/common/reponse';
import dayjs from 'dayjs';

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
        createdAt: dayjs().valueOf(),
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
          value: attribute.value.toLowerCase(),
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
    target.value = updateValue.toLowerCase();
    await this.landlordAttributeRepository.save(target);
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'attribute updated',
    };
  }

  async updateAttributes(updateInputArray: AttributeUpdateInput[]) {
    try {
      await Promise.all(
        updateInputArray.map(async (updateInput) => {
          const target = await this.landlordAttributeRepository.findOneBy({
            id: updateInput.id,
          });
          target.value = updateInput.value.toLowerCase();
          return this.landlordAttributeRepository.save(target);
        }),
      );

      return {
        type: ActionStatus.SUCCESSFUL,
        message: 'Updated',
      };
    } catch (e) {
      console.error(e);
      return {
        type: ActionStatus.FAILED,
        message: 'Not updated',
      };
    }
  }

  async deleteAttribute(id: string) {
    await this.landlordAttributeRepository.delete({ id: id });
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'attribute updated',
    };
  }

  async deleteAttributes(ids: string[]) {
    await Promise.all(
      ids.map((id) => {
        this.landlordAttributeRepository.delete({ id: id });
      }),
    );
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'Deleted',
    };
  }

  async getMany(queryParams: QueryParams): Promise<Landlord[]> {
    return await queryMany(this.landlordRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Landlord> {
    return await queryOne(this.landlordRepository, queryParams);
  }

  async checkExist(username: string): Promise<boolean> {
    const check = await queryDistinct(this.landlordRepository, 'username', [
      {
        key: 'username',
        value: username,
        operator: Operator.EQUAL,
      },
    ]);
    if (Array.isArray(check) && check.length > 0) return true;
    return false;
  }
}
