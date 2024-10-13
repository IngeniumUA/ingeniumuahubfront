export enum PaymentStatusEnum {
  // Normal transaction related
  all = 0, // TODO This should be in its own enum tbh ...

  successful = 1,
  cancelled = 2,
  failed = 3,
  pending = 4,

  // Refund related
  refund_pending = 5,
  refunded = 6,
  partially_refunded = 7
}
