import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CompletedBooking } from './completed-booking.entity';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { BookingInput } from '../dto/create_booking.dto';
import { PlaceService } from 'src/place/place.service';
import { TenantService } from 'src/tenant/tenant.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { queryMany, QueryParams, queryOne } from 'src/common/query_function';
import { ActionStatus, BookingStatus } from 'src/common/constants';
import { BookingUpdateInput } from '../dto/update_booking.dto';
import { QueryResponse } from 'src/common/reponse';
import dayjs from 'dayjs';
import { PendingBookingService } from '@booking/pending_booking/pending-booking.service';
import { ActiveBookingService } from '@booking/active_booking/active-booking.service';

@Injectable()
export class CompletedBookingService {
  private completedBookingRepository: Repository<CompletedBooking>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private dataSource: DataSource,
    @Inject(forwardRef(() => ActiveBookingService))
    private activeBookingService: ActiveBookingService,
    @Inject(forwardRef(() => PendingBookingService))
    private pendingBookingService: PendingBookingService,
    private tenantService: TenantService,
    private placeService: PlaceService,
  ) {
    this.completedBookingRepository =
      this.dataSource.getRepository(CompletedBooking);
  }
  async fromPendingToCanceled(bookingId: string): Promise<InsertResult> {
    const booking = await this.pendingBookingService.getOnePendingBooking({
      queryType: 'id',
      queryValue: bookingId,
    });
    const completedBooking = { ...booking, status: BookingStatus.CANCELED };
    return await this.completedBookingRepository.insert(completedBooking);
  }
  async fromActiveToCompleted(bookingId: string): Promise<InsertResult> {
    const booking = await this.activeBookingService.getOneActiveBooking({
      queryType: 'id',
      queryValue: bookingId,
    });
    const completedBooking = { ...booking, status: BookingStatus.COMPLETED };
    return await this.completedBookingRepository.insert(completedBooking);
  }
  async fromActiveToCanceled(bookingId: string): Promise<InsertResult> {
    const booking = await this.activeBookingService.getOneActiveBooking({
      queryType: 'id',
      queryValue: bookingId,
    });
    const completedBooking = { ...booking, status: BookingStatus.CANCELED };
    return await this.completedBookingRepository.insert(completedBooking);
  }
  async checkExistById(bookingId: string): Promise<Boolean> {
    const exist = await this.completedBookingRepository.exists({
      where: { id: bookingId },
    });
    return exist;
  }

  async getManyCompletedBookings(
    queryParams: QueryParams,
  ): Promise<CompletedBooking[]> {
    return await queryMany(this.completedBookingRepository, queryParams);
  }
  async getOneCompletedBooking(
    queryParams: QueryParams,
  ): Promise<CompletedBooking> {
    return await queryOne(this.completedBookingRepository, queryParams);
  }
}
