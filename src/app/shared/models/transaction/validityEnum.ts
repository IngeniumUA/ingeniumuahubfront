export enum ValidityEnum {
  forbidden= 1,
  valid = 2,
  invalid = 3,
  manually_verified = 4,
  consumed = 5
}

export const ValidityList = [
  ValidityEnum.forbidden,
  ValidityEnum.valid,
  ValidityEnum.invalid,
  ValidityEnum.manually_verified,
  ValidityEnum.consumed,
]
