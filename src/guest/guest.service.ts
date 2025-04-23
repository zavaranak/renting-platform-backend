import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { CreateGuestInput, UpdateGuestInput } from './dto/guest.input';
import { queryOne, queryMany, QueryParams } from '@common/query.handler';
import { QueryResponse } from '@common/reponse.type';
import { ActionStatus } from '@common/constants';
import { TenantService } from '@tenant/tenant.service';
import dayjs from 'dayjs';

@Injectable()
export default class GuestService {
  private guestRepository: Repository<Guest>;

  constructor(
    @Inject('DATA_SOURCE_PSQL') private datasource: DataSource,
    private tenantSerice: TenantService,
  ) {
    this.guestRepository = this.datasource.getRepository(Guest);
  }
  // Create a new profile
  async create(input: CreateGuestInput): Promise<QueryResponse> {
    const checkTenant = await this.tenantSerice.checkExistById(input.tenantId);
    if (checkTenant) {
      // const profile = this.guestRepository.create(input);
      input.createdAt = dayjs().valueOf();
      const newGuest = await this.guestRepository.save(input);
      const response: QueryResponse = {
        message: 'Guest created successfully',
        guest: newGuest,
        type: ActionStatus.SUCCESSFUL,
      };
      return response;
    } else {
      return {
        message: 'Tenant ID is required',
        type: ActionStatus.FAILED,
      };
    }
  }

  // Find a profile by ID
  async getOne(queryParams: QueryParams): Promise<QueryResponse> {
    const guest = await queryOne(this.guestRepository, queryParams);
    if (guest) {
      return {
        message: 'Guest found',
        guest,
        type: ActionStatus.SUCCESSFUL,
      };
    } else {
      return {
        message: 'Guest not found',
        type: ActionStatus.FAILED,
      };
    }
  }

  // Update a profile
  async update(id: string, input: UpdateGuestInput): Promise<QueryResponse> {
    await this.guestRepository.update(id, input);
    const newGuest = await queryOne(this.guestRepository, {
      queryType: 'id',
      queryValue: id,
    });
    if (newGuest) {
      return {
        message: 'Guest updated successfully',
        guest: newGuest,
        type: ActionStatus.SUCCESSFUL,
      };
    } else {
      return {
        message: 'Guest not found',
        type: ActionStatus.FAILED,
      };
    }
  }

  // Delete a profile
  async delete(id: string): Promise<QueryResponse> {
    const result = await this.guestRepository.delete(id);
    if (result.affected) {
      return {
        message: 'Guest deleted successfully',
        type: ActionStatus.SUCCESSFUL,
      };
    } else {
      return {
        message: 'Guest not found',
        type: ActionStatus.FAILED,
      };
    }
  }

  // Find all profiles
  async getMany(queryParams: QueryParams): Promise<Guest[]> {
    const guests = await queryMany(this.guestRepository, queryParams);
    return guests;
  }
}
