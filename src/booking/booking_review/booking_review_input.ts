import { Field, InputType } from '@nestjs/graphql';
import * as Upload from 'graphql-upload/Upload.js';

@InputType()
export class BookingReviewInput {
  @Field()
  createdAt: number;
  @Field()
  star: number;
  @Field()
  tenantId: string;
  @Field()
  bookingId: string;
  @Field()
  placeId: string;
  @Field()
  textReview: string;
  @Field(() => [Upload], { nullable: true })
  uploadedPhotos?: Upload[];
}
