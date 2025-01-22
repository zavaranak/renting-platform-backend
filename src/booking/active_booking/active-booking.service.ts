import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ActiveBooking } from './active-booking.entity';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { BookingInput } from '../dto/create_booking.dto';
import { PlaceService } from 'src/place/place.service';
import { TenantService } from 'src/tenant/tenant.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { queryMany, QueryParams, queryOne } from 'src/common/query_function';
import { ActionStatus, BookingStatus, TermUnit } from 'src/common/constants';
import { BookingUpdateInput } from '../dto/update_booking.dto';
import { QueryResponse } from 'src/common/reponse';
import dayjs from 'dayjs';
import { PendingBookingService } from '@booking/pending_booking/pending-booking.service';
import { CompletedBookingService } from '@booking/completed_booking/completed-booking.service';

@Injectable()
export class ActiveBookingService {
  private activeBookingRepository: Repository<ActiveBooking>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private dataSource: DataSource,
    @Inject(forwardRef(() => PendingBookingService))
    private readonly pendingBookingService: PendingBookingService,
    @Inject(forwardRef(() => CompletedBookingService))
    private readonly completedBookingService: CompletedBookingService,
  ) {
    this.activeBookingRepository = this.dataSource.getRepository(ActiveBooking);
  }
  async fromPendingToActive(bookingId: string): Promise<InsertResult> {
    const booking = await this.pendingBookingService.getOnePendingBooking({
      queryType: 'id',
      queryValue: bookingId,
    });
    return await this.activeBookingRepository.insert(booking);
  }

  async cancel(bookingId: string): Promise<QueryResponse> {
    try {
      const result: InsertResult =
        await this.completedBookingService.fromActiveToCanceled(bookingId);
      if (
        result.identifiers &&
        result.identifiers.length > 0 &&
        result.identifiers[0].id
      ) {
        await this.activeBookingRepository.delete({ id: bookingId });
        return {
          type: ActionStatus.SUCCESSFUL,
          message: 'Active booking is now canceled',
        };
      } else {
        return {
          type: ActionStatus.FAILED,
          message: `Unable to cancel active booking`,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        type: ActionStatus.FAILED,
        message: `Unable to cancel active booking`,
      };
    }
  }
  async complete(bookingId: string): Promise<QueryResponse> {
    try {
      const result: InsertResult =
        await this.completedBookingService.fromActiveToCompleted(bookingId);
      if (
        result.identifiers &&
        result.identifiers.length > 0 &&
        result.identifiers[0].id
      ) {
        await this.activeBookingRepository.delete({ id: bookingId });
        return {
          type: ActionStatus.SUCCESSFUL,
          message: 'Active booking is now completed',
        };
      } else {
        return {
          type: ActionStatus.FAILED,
          message: `Unable to complete active booking`,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        type: ActionStatus.FAILED,
        message: `Unable to complete active booking`,
      };
    }
  }

  async checkExistById(bookingId: string): Promise<Boolean> {
    const exist = await this.activeBookingRepository.exists({
      where: { id: bookingId },
    });
    return exist;
  }
  async getManyActiveBookings(
    queryParams: QueryParams,
  ): Promise<ActiveBooking[]> {
    return await queryMany(this.activeBookingRepository, queryParams);
  }
  async getOneActiveBooking(queryParams: QueryParams): Promise<ActiveBooking> {
    return await queryOne(this.activeBookingRepository, queryParams);
  }
}
