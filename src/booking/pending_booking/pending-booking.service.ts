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
import { queryMany, QueryParams, queryOne } from '@common/query.handler';
import {
  ActionStatus,
  BookingStatus,
  SubjectEmail,
} from 'src/common/constants';
import { BookingUpdateInput } from '../dto/update_booking.dto';
import { QueryResponse } from '@common/reponse.type';
import dayjs from 'dayjs';
import { ActiveBookingService } from '@booking/active_booking/active-booking.service';
import { CompletedBookingService } from '@booking/completed_booking/completed-booking.service';
import { EmailGrpcService } from 'src/email-by-grpc/email.service';
import { Roles } from '@auth/dto/auth_input';

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
    private emailService: EmailGrpcService,
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
        payment,
        guests,
      } = bookingInput;
      const tenantExists = await this.tenantService.checkExistById(tenantId);
      const place = await this.placeService.getOne({
        queryType: 'id',
        queryValue: placeId,
        entityFields: ['mainTable.id'],
        relations: ['landlord'],
      });
      if (!tenantExists) {
        return {
          message: 'Tenant does not exist',
          type: ActionStatus.FAILED,
        };
      }
      if (!place) {
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
        payment: payment,
        guests: guests,
      };
      const newPendingBooking =
        await this.pendingBookingRepository.save(booking);

      this.emailService.sendEmailToUser(
        tenantId,
        SubjectEmail.BOOKING_CREATION_TENANT,
        Roles.TENANT,
      );
      this.emailService.sendEmailToUser(
        place.landlord.id,
        SubjectEmail.BOOKING_CREATION_LANDLORD,
        Roles.LANDLORD,
      );
      return {
        pendingBooking: newPendingBooking,
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
        this.emailService.sendEmailToUser(
          'tenantId',
          SubjectEmail.BOOKING_CANCELLATION_BY_TENANT,
          Roles.TENANT,
        );
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
