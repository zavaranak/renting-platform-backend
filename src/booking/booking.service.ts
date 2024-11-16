import { Inject, Injectable } from '@nestjs/common';
import { Booking } from './booking.entity';
import { DataSource, Repository } from 'typeorm';
import { BookingInput } from './dto/create_booking.dto';
import { PlaceService } from 'src/place/place.service';
import { TenantService } from 'src/tenant/tenant.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { queryMany, QueryParams, queryOne } from 'src/common/query_function';
import { ActionStatus, BookingStatus } from 'src/common/constants';
import { BookingUpdateInput } from './dto/update_booking.dto';
import { QueryResponse } from 'src/common/reponse';
import dayjs from 'dayjs';

@Injectable()
export class BookingService {
  private bookingRepository: Repository<Booking>;

  constructor(
    @Inject('DATA_SOURCE_PSQL') private dataSource: DataSource,
    private tenantService: TenantService,
    private placeService: PlaceService,
  ) {
    this.bookingRepository = this.dataSource.getRepository(Booking);
  }

  async createOne(bookingInput: BookingInput): Promise<QueryResponse> {
    try {
      const tenant = await this.tenantService.getOne({
        queryValue: bookingInput.tenantId,
        queryType: 'id',
      });
      const place = await this.placeService.getOne({
        queryValue: bookingInput.placeId,
        queryType: 'id',
      });
      const currentTime = dayjs().valueOf();
      const booking: Booking = {
        createdAt: currentTime,
        lastUpdate: currentTime,
        startAt: bookingInput.startAt,
        endAt: bookingInput.endAt,
        termUnit: bookingInput.termUnit,
        period: bookingInput.period,
        totalCharge: bookingInput.totalCharge,
        status: BookingStatus.IN_PROCESS,
        tenant: tenant,
        place: place,
      };
      const newBooking = await this.bookingRepository.save(booking);
      return {
        booking: newBooking,
        message: 'Created new Booking',
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.log('An error occurred while creating Booking', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Booking',
      );
    }
  }

  async getMany(queryParams: QueryParams): Promise<Booking[]> {
    return await queryMany(this.bookingRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Booking> {
    return await queryOne(this.bookingRepository, queryParams);
  }

  async updateOne(bookingUpdateInput: BookingUpdateInput) {
    const booking = await this.getOne({
      queryValue: bookingUpdateInput.id,
      queryType: 'id',
    });
    try {
      for (const [key, value] of Object.entries(bookingUpdateInput)) {
        if (key === 'id') continue;
        booking[key] = value;
      }
      console.log(booking);
      const updatedBooking = await this.bookingRepository.save({ ...booking });
      return { booking: updatedBooking, message: 'Updated booking' };
    } catch (error) {
      console.error(
        `An error occurred while updating place ${bookingUpdateInput.id}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating booking',
      );
    }
  }
}
