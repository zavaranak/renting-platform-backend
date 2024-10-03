export const EMAIL_EXISTED = 'email is already used';
export const NO_ACTIONS = 'action is not defined';
export enum UserStatus {
  VERIFIED = 'verified',
  NOT_VERIFIRED = 'not_verified',
  BLOCKED = 'blocked',
  SOFT_DELETED = 'soft_deleted',
}
export enum TenantAttributeNames {
  FIRSTNAME = 'first_name',
  LASTNAME = 'last_name',
  MIDDLENAME = 'middle_name',
  TEL = 'tel',
  SEX = 'sex',
  BIRTH_DAY = 'birth_day',
  DOCUMENT = 'document',
  COUNTRY = 'country',
}

export enum AttributeTypes {
  STRING = 'string',
  REAL = 'real',
  INTEGER = 'integer',
  JSON = 'json',
  BOOLEAN = 'boolean',
}
