import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BookingReview } from './booking_review.entity';
import { BookingReviewInput } from './booking_review_input';
import { UploadFile, uploadFilesFromStream } from 'src/common/upload_files';
import { extname } from 'path';
import { ActionStatus, PhotoExtention, UploadType } from 'src/common/constants';
import { TenantService } from 'src/tenant/tenant.service';
import { CompletedBookingService } from '@booking/completed_booking/completed-booking.service';
import { QueryResponse } from 'src/common/reponse';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingReviewService {
  // private BookingReViewRepository: Repository<BookingReview>;
  // private tenantService: TenantService;
  // private CompletedBookingService: CompletedBookingService;
  // constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
  //   this.BookingReViewRepository = this.datasource.getRepository(BookingReview);
  // }
  // async createOne(
  //   bookingReviewInput: BookingReviewInput,
  // ): Promise<QueryResponse> {
  //   const parsedImages: UploadFile[] = [];
  //   let imageValidation: boolean;
  //   if (bookingReviewInput.uploadedPhotos) {
  //     imageValidation = true;
  //     const resolvedImages = await Promise.all(
  //       bookingReviewInput.uploadedPhotos,
  //     );
  //     for (let i = 0; i < resolvedImages.length; i++) {
  //       const ext: string = extname(resolvedImages[i].filename).toLowerCase();
  //       imageValidation = (Object.values(PhotoExtention) as string[]).includes(
  //         ext,
  //       );
  //       if (!imageValidation) {
  //         break;
  //       }
  //       parsedImages.push({
  //         createReadStream: resolvedImages[i].createReadStream,
  //         filename: uuidv4() + ext,
  //         id: bookingReviewInput.bookingId,
  //         uploadType: UploadType.BOOKING_REVIEW_IMAGE,
  //         placeId: bookingReviewInput.placeId,
  //       });
  //     }
  //   }
  //   let imagesUrl: string[];
  //   if (imageValidation) {
  //     imagesUrl = await uploadFilesFromStream(parsedImages);
  //   }
  //   const review: BookingReview = await {
  //     star: bookingReviewInput.star,
  //     tenant: await this.tenantService.getOne({
  //       queryValue: bookingReviewInput.tenantId,
  //       queryType: 'id',
  //     }),
  //     booking: await this.CompletedBookingService.getOne({
  //       queryValue: bookingReviewInput.bookingId,
  //       queryType: 'id',
  //     }),
  //     createdAt: Date.now(),
  //     reviewPhotos: imagesUrl,
  //     reviewText: bookingReviewInput.textReview,
  //   };
  //   const newReview = await this.BookingReViewRepository.save(review);
  //   return {
  //     bookingReview: newReview,
  //     message: 'created review',
  //     type: ActionStatus.SUCCESSFUL,
  //   };
  // }
}
