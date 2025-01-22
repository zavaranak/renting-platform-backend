import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PendingBooking } from './pending-booking.entity';
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
import { ActiveBookingService } from '@booking/active_booking/active-booking.service';
import { CompletedBookingService } from '@booking/completed_booking/completed-booking.service';

@Injectable()
export class PendingBookingService {
  private pendingBookingRepository: Repository<PendingBooking>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private dataSource: DataSource,
    @Inject(forwardRef(() => ActiveBookingService))
    private activeBookingService: ActiveBookingService,
    @Inject(forwardRef(() => CompletedBookingService))
    private completedBookingService: CompletedBookingService,
    private tenantService: TenantService,
    private placeService: PlaceService,
  ) {
    this.pendingBookingRepository =
      this.dataSource.getRepository(PendingBooking);
  }
  async createOne(bookingInput: BookingInput): Promise<QueryResponse> {
    try {
      const {
        startAt,
        endAt,
        termUnit,
        period,
        totalCharge,
        tenantId,
        placeId,
      } = bookingInput;
      const tenantExists = await this.tenantService.checkExistById(tenantId);
      const placeExists = await this.placeService.checkExistById(placeId);
      if (!tenantExists) {
        return {
          message: 'Tenant does not exist',
          type: ActionStatus.FAILED,
        };
      }
      if (!placeExists) {
        return {
          message: 'Place does not exist',
          type: ActionStatus.FAILED,
        };
      }
      const currentTime = dayjs().valueOf();
      const booking: PendingBooking = {
        createdAt: currentTime,
        lastUpdate: currentTime,
        startAt: startAt,
        endAt: endAt,
        termUnit: termUnit,
        period: period,
        totalCharge: totalCharge,
        tenantId: tenantId,
        placeId: placeId,
      };
      const newActiveBooking =
        await this.pendingBookingRepository.save(booking);

      await this.tenantService.updateBooking(tenantId, newActiveBooking.id);

      return {
        activeBooking: newActiveBooking,
        message: 'Created new Booking',
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.log('An error occurred while creating new booking', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Booking',
      );
    }
  }

  async getManyPendingBookings(
    queryParams: QueryParams,
  ): Promise<PendingBooking[]> {
    return await queryMany(this.pendingBookingRepository, queryParams);
  }
  async getOnePendingBooking(
    queryParams: QueryParams,
  ): Promise<PendingBooking> {
    return await queryOne(this.pendingBookingRepository, queryParams);
  }
  async updateBooking(bookingUpdateInput: BookingUpdateInput) {
    const booking = await this.getOnePendingBooking({
      queryValue: bookingUpdateInput.id,
      queryType: 'id',
    });
    try {
      for (const [key, value] of Object.entries(bookingUpdateInput)) {
        if (key === 'id') continue;
        booking[key] = value;
      }
      const updatedBooking = await this.pendingBookingRepository.save({
        ...booking,
      });
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
  async moveToActive(bookingId: string): Promise<QueryResponse> {
    try {
      const result: InsertResult =
        await this.activeBookingService.fromPendingToActive(bookingId);
      if (
        result.identifiers &&
        result.identifiers.length > 0 &&
        result.identifiers[0].id
      ) {
        await this.pendingBookingRepository.delete({ id: bookingId });
        return {
          type: ActionStatus.SUCCESSFUL,
          message: 'Booking is now active',
        };
      } else {
        return {
          type: ActionStatus.FAILED,
          message: 'Unable to change booking status to active',
        };
      }
    } catch (e) {
      console.log(e);
      return {
        type: ActionStatus.FAILED,
        message: 'Unable to change booking status to active',
      };
    }
  }
  async moveToCompleted(bookingId: string) {
    try {
      const result: InsertResult =
        await this.completedBookingService.fromPendingToCanceled(bookingId);
      if (
        result.identifiers &&
        result.identifiers.length > 0 &&
        result.identifiers[0].id
      ) {
        await this.pendingBookingRepository.delete({ id: bookingId });
        return {
          type: ActionStatus.SUCCESSFUL,
          message: 'Pending booking is now cancel',
        };
      } else {
        return {
          type: ActionStatus.FAILED,
          message: `Unable to cancel pending booking`,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        type: ActionStatus.FAILED,
        message: `Unable to cancel pending booking`,
      };
    }
  }
}
