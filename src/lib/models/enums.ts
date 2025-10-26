export enum ValidityEnum {
  all = 0,
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

export enum PaymentStatusEnum {
  // Normal transaction related
  all = 0, // TODO: This should be in its own enum tbh ...

  successful = 1,
  cancelled = 2,
  failed = 3,
  pending = 4,

  // Refund related
  refund_pending = 5,
  refunded = 6,
  partially_refunded = 7
}

export const PaymentStatusList = [
  PaymentStatusEnum.successful,
  PaymentStatusEnum.cancelled,
  PaymentStatusEnum.failed,
  PaymentStatusEnum.pending,
  PaymentStatusEnum.refund_pending,
  PaymentStatusEnum.refunded,
  PaymentStatusEnum.partially_refunded,
]