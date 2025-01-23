import { registerEnumType } from '@nestjs/graphql';

export const EMAIL_EXISTED = 'email_is_already_used';
export const NO_ACTIONS = 'action_is_not_defined';
export enum UserStatus {
  VERIFIED = 'verified',
  NOT_VERIFIRED = 'not_verified',
  BLOCKED = 'blocked',
  SOFT_DELETED = 'soft_deleted',
}

export enum PlaceStatus {
  FOR_RENT = 'for_rent',
  NOT_FORENT = 'not_for_rent',
  OCCUPIED = 'occupied',
}
export enum BookingStatus {
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export enum ActionStatus {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

registerEnumType(ActionStatus, { name: 'ActionStatus' });

export enum AttributesStatus {
  UPDATED = 'updated',
  NOT_UPDATED = 'failed_to_update',
}

export enum TenantAttributeName {
  FIRSTNAME = 'first_name',
  LASTNAME = 'last_name',
  MIDDLENAME = 'middle_name',
  TEL = 'tel',
  SEX = 'sex',
  BIRTH_DAY = 'birth_day',
  DOCUMENT = 'document',
  COUNTRY = 'country',
  AVATAR = 'avatar',
}

export enum LandlordAttributeName {
  FIRSTNAME = 'first_name',
  LASTNAME = 'last_name',
  MIDDLENAME = 'middle_name',
  TEL = 'tel',
  COMPANY = 'company',
  BIRTH_DAY = 'birth_day',
  AVATAR = 'avatar',
  DOCUMENT = 'document',
  COUNTRY = 'country',
}

export enum PlaceAttributeName {
  PRIVATE_BATHROOM = 'private_bathroom',
  PRIVATE_KITCHEN = 'private_kitchen',
  SHARED_BATHROOM = 'shared_bathroom',
  SHARED_KITCHEN = 'shared_kitchen',
  LAUNDRY = 'laundry',
  AIR_CONDITIONER = 'air_conditioner',
  WIFI = 'wifi',
  ETHERNET = 'ethernet',
  FURNISHED = 'furnished',
  PARKING = 'parking',
  BALCONY = 'balcony',
  PET_FRIENDLY = 'pet_friendly',
  SMOKING_ALLOWED = 'smoking_allowed',
  ELEVATOR = 'elevator',
  GYM = 'gym',
  POOL = 'pool',
  HEATING = 'heating',
  ROOM_SERVICE = 'room_service',
  SECURITY = 'security',
  GARDEN = 'garden',
  PLAYGROUND = 'playground',
  PRICE_BY_HOUR = 'price_by_hour',
  PRICE_BY_DAY = 'price_by_day',
  PRICE_BY_WEEK = 'price_by_week',
  PRICE_BY_MONTH = 'price_by_month',
  MAX_GUEST = 'max_guest',
}

export enum PlaceTypes {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  DORMITORY = 'dormitory',
  STUDIO = 'studio',
  HOTEL = 'hotel',
  OFFICE = 'office',
  WORKSHOP = 'workshop',
  FACTORY = 'fatory',
  WAREHOURSE = 'warehourse',
  SHOPHOUSE = 'shop house',
  COWORKING_SPACE = 'coworking space',
  EVENT_SPACE = 'event space',
}

registerEnumType(PlaceTypes, {
  name: 'PlaceTypes',
});

registerEnumType(PlaceStatus, {
  name: 'PlaceStatus',
});

export enum TermUnit {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

registerEnumType(TermUnit, { name: 'TermUnit' });

export enum SourceType {
  BOOKING = 'booking',
  TENANT = 'tenant',
  PLACE = 'place',
  LANDLORD = 'landlord',
}

export enum UploadType {
  PROFILE_IMAGE = 'profile_image',
  PLACE_IMAGE = 'place',
  BOOKING_REVIEW_IMAGE = 'place_review',
}

export enum PhotoExtention {
  JPG = '.jpg',
  JPEG = '.jpeg',
  PNG = '.png',
  SVG = '.svg',
  GIF = '.gif',
  WEBP = '.webp',
  AVIF = '.avif',
}

export enum NotificationType {
  TENANT_NEW_REQUEST = 'tenant sends request',
  TENANT_CANCEL_REQUEST = 'tenant cancels request',
  TENANT_ACCEPT_REQUEST = 'tenant accepts request',
  LANDLORD_NEW_REQUEST = 'landlord sends request',
  LANDLORD_CANCEL_REQUEST = 'landlord cancels request',
  LANDLORD_ACCEPT_REQUEST = 'landlord accepts request',
}

registerEnumType(NotificationType, { name: 'NotificationType' });

export interface NotificationData {
  target: string;
  type: NotificationType;
  bookingId?: string;
  placeId?: string;
}

// export enum AbstractAttributesName {PlaceAttributeName}

export const AbstractAttributesName = {
  ...PlaceAttributeName,
  ...TenantAttributeName,
  ...LandlordAttributeName,
};

// export type AbstractAttributesName = typeof PlaceAttributeName;

export type AbstractAttributesType = typeof PlaceAttributeName &
  typeof TenantAttributeName &
  typeof LandlordAttributeName;

export enum PaymentStatus {
  PAID_CARD = 'paid-card',
  UNPAID_CARD = 'unpaid-card ',
  PAID_ON_SPOT = 'paid-on-spot',
  UNPAID_ON_SPOT = 'unpaid-on-spot',
}

registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
