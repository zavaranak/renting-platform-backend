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
import { queryMany, QueryParams, queryOne } from 'src/common/query_function';
import { TenantAttributeInput } from './tenant_attribute_input';
import { QueryResponse } from 'src/common/reponse';
import * as bcrypt from 'bcrypt';

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
        createdAt: Date.now(),
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
          value: attribute.value,
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

  async getMany(queryParams: QueryParams): Promise<Tenant[]> {
    return await queryMany(this.tenantRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Tenant> {
    return await queryOne(this.tenantRepository, queryParams);
  }
}
