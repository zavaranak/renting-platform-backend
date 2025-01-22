import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from './tenant.entity';
import {
  ActionStatus,
  AttributesStatus,
  TenantAttributeName,
  UserStatus,
} from 'src/common/constants';
import { DataSource, Repository } from 'typeorm';
import { TenantAttribute } from './tenant_attribute.entity';
import {
  queryMany,
  QueryParams,
  queryOne,
  queryDistinct,
  Operator,
} from 'src/common/query_function';
import { TenantAttributeInput } from './tenant_attribute_input';
import { QueryResponse } from 'src/common/reponse';
import * as bcrypt from 'bcrypt';
import { AttributeUpdateInput } from 'src/common/attribute_update_input';
import dayjs from 'dayjs';

@Injectable()
export class TenantService {
  private tenantRepository: Repository<Tenant>;
  private tenantAttributeRepository: Repository<TenantAttribute>;

  constructor(@Inject('DATA_SOURCE_PSQL') private dataSource: DataSource) {
    try {
      this.tenantRepository = this.dataSource.getRepository(Tenant);
      this.tenantAttributeRepository =
        this.dataSource.getRepository(TenantAttribute);
    } catch (error) {
      console.error('Error while creating tenantRepository:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while connect to Tenant Repository',
      );
    }
  }

  async createOne(username: string, password: string): Promise<Tenant> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const tenant: Tenant = {
        username: username,
        password: hashedPassword,
        createdAt: dayjs().valueOf(),
        status: UserStatus.VERIFIED,
      };
      return await this.tenantRepository.save(tenant);
    } catch (error) {
      console.log('An error occurred while creating Tenant', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Tenant',
      );
    }
  }

  async addAttributes(
    tenantId: string,
    attributes: TenantAttributeInput[],
  ): Promise<QueryResponse> {
    console.log(attributes);
    const tenant = await this.getOne({ queryValue: tenantId, queryType: 'id' });
    const newAttributes: TenantAttribute[] = await Promise.all(
      attributes.map(async (attribute) => {
        const type =
          attribute.name === TenantAttributeName.BIRTH_DAY ? 'date' : 'string';
        return {
          name: attribute.name,
          value: attribute.value.toLowerCase(),
          type: type,
          tenant: tenant,
        };
      }),
    );
    try {
      await this.tenantAttributeRepository.save(newAttributes);

      return {
        message: AttributesStatus.UPDATED,
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.error('An error occurred while adding attribute to tenant');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while adding attribute to tenant',
      );
    }
  }
  async updateAttribute(id: string, updateValue: string) {
    const target = await this.tenantAttributeRepository.findOneBy({ id: id });
    target.value = updateValue.toLowerCase();
    await this.tenantAttributeRepository.save(target);
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'Updated',
    };
  }
  async updateAttributes(updateInputArray: AttributeUpdateInput[]) {
    try {
      await Promise.all(
        updateInputArray.map(async (updateInput) => {
          const target = await this.tenantAttributeRepository.findOneBy({
            id: updateInput.id,
          });
          target.value = updateInput.value.toLowerCase();
          return this.tenantAttributeRepository.save(target);
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

  async deleteAttributes(ids: string[]) {
    await Promise.all(
      ids.map((id) => {
        this.tenantAttributeRepository.delete({ id: id });
      }),
    );
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'Deleted',
    };
  }

  async getMany(queryParams: QueryParams): Promise<Tenant[]> {
    return await queryMany(this.tenantRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Tenant> {
    return await queryOne(this.tenantRepository, queryParams);
  }

  async updateBooking(tenantId: string, bookingId: string) {
    try {
      const updateCheck = await this.tenantRepository
        .createQueryBuilder()
        .update()
        .set({ bookings: () => `array_append(bookings, :newBookingID)` })
        .where(`id = :id`, { id: tenantId })
        .setParameter('newBookingID', bookingId)
        .execute();
      if (updateCheck.affected === 0) {
        throw new Error(`Tenant with id ${tenantId} not found.`);
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async checkExist(username: string): Promise<boolean> {
    const check = await queryDistinct(this.tenantRepository, 'username', [
      {
        key: 'username',
        value: username,
        operator: Operator.EQUAL,
      },
    ]);
    if (Array.isArray(check) && check.length > 0) return true;
    return false;
  }
  async checkExistById(tenantId: string): Promise<boolean> {
    const exists = await this.tenantRepository.exists({
      where: { id: tenantId },
    });
    return exists;
  }
}
