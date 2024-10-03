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

@Injectable()
export class BookingService {
  private bookingRepository: Repository<Booking>;
  private tenantService: TenantService;
  private placeService: PlaceService;
  constructor(@Inject('DATA_SOURCE_PSQL') private dataSource: DataSource) {
    this.bookingRepository = this.dataSource.getRepository(Booking);
  }

  async findAll(relations: string[]): Promise<Booking[]> {
    try {
      return this.bookingRepository.find({
        relations: relations,
      });
    } catch (error) {
      console.error(`An error occurred while finding Bookings: `, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Bookings',
      );
    }
  }

  async findOneById(id: string, relations: string[]): Promise<Booking> {
    try {
      return this.bookingRepository.findOne({
        where: { id },
        relations: relations,
      });
    } catch (error) {
      console.error(
        `An error occurred while finding Booking with id ${id}: `,
        error,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Booking',
      );
    }
  }

  async createOne(bookingInput: BookingInput) {
    try {
      const tenant = await this.tenantService.findOneById(
        bookingInput.tenantId,
      );
      const place = await this.placeService.findOneById(
        bookingInput.placeId,
        [],
      );
      const currentTime = Date.now();
      const booking: Booking = {
        createdAt: currentTime,
        lastUpdate: currentTime,
        startAt: bookingInput.startAt,
        endAt: bookingInput.endAt,
        termUnit: bookingInput.termUnit,
        period: bookingInput.period,
        totalCharge: bookingInput.totalCharge,
        tenant: tenant,
        place: place,
      };
      return await this.bookingRepository.save(booking);
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
}
