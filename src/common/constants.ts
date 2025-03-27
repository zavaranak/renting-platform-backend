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
  FIRSTNAME = 'FIRSTNAME',
  LASTNAME = 'LASTNAME',
  MIDDLENAME = 'MIDDLENAME',
  TEL = 'TEL',
  GENDER = 'GENDER',
  BIRTHDAY = 'BIRTHDAY',
  DOCUMENT = 'DOCUMENT',
  COUNTRY = 'COUNTRY',
  AVATAR = 'AVATAR',
}

export enum LandlordAttributeName {
  FIRSTNAME = 'FIRSTNAME',
  LASTNAME = 'LASTNAME',
  MIDDLENAME = 'MIDDLENAME',
  TEL = 'TEL',
  GENDER = 'GENDER',
  COMPANY = 'COMPANY',
  BIRTHDAY = 'BIRTHDAY',
  AVATAR = 'AVATAR',
  DOCUMENT = 'DOCUMENT',
  COUNTRY = 'COUNTRY',
}

export enum PlaceAttributeName {
  PRIVATE_BATHROOM = 'PRIVATE_BATHROOM',
  PRIVATE_KITCHEN = 'PRIVATE_KITCHEN',
  SHARED_BATHROOM = 'SHARED_BATHROOM',
  SHARED_KITCHEN = 'SHARED_KITCHEN',
  LAUNDRY = 'LAUNDRY',
  AIR_CONDITIONER = 'AIR_CONDITIONER',
  WIFI = 'WIFI',
  ETHERNET = 'ETHERNET',
  FURNISHED = 'FURNISHED',
  PARKING = 'PARKING',
  BALCONY = 'BALCONY',
  PET_FRIENDLY = 'PET_FRIENDLY',
  SMOKING_ALLOWED = 'SMOKING_ALLOWED',
  ELEVATOR = 'ELEVATOR',
  GYM = 'GYM',
  POOL = 'POOL',
  HEATING = 'HEATING',
  ROOM_SERVICE = 'ROOM_SERVICE',
  SECURITY = 'SECURITY',
  GARDEN = 'GARDEN',
  PLAYGROUND = 'PLAYGROUND',
  PRICE_BY_HOUR = 'PRICE_BY_HOUR',
  PRICE_BY_DAY = 'PRICE_BY_DAY',
  PRICE_BY_WEEK = 'PRICE_BY_WEEK',
  PRICE_BY_MONTH = 'PRICE_BY_MONTH',
  MAX_GUEST = 'MAX_GUEST',
}
export enum PlaceTypes {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  DORMITORY = 'DORMITORY',
  STUDIO = 'STUDIO',
  HOTEL = 'HOTEL',
  OFFICE = 'OFFICE',
  WORKSHOP = 'WORKSHOP',
  FACTORY = 'FACTORY',
  WAREHOURSE = 'WAREHOURSE',
  SHOPHOUSE = 'SHOPHOUSE',
  COWORKING_SPACE = 'COWORKING_SPACE',
  EVENT_SPACE = 'EVENT_SPACE',
}

registerEnumType(PlaceTypes, {
  name: 'PlaceTypes',
});

registerEnumType(PlaceStatus, {
  name: 'PlaceStatus',
});

export enum TermUnit {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
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

export enum Payment {
  CASH,
  CARD,
}

registerEnumType(Payment, { name: 'Payment' });

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}
registerEnumType(Gender, { name: 'Gender' });
