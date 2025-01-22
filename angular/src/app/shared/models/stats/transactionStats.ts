import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";

export interface StatusStatsI {
  0: number  // All
  1: number  // Successful
  2: number  // Cancelled
  3: number  // Failed
  4: number  // Pending
  5: number  // Refund Pending
  6: number  // Refunded
  7: number  // Partially refunded
}

export function StatusToStats(status: number, statsObject: StatusStatsI): number {
  if (status === 0) {  // '0' is all
    return statsObject[PaymentStatusEnum.all];
  }
  else if (status === PaymentStatusEnum.successful) {
    return statsObject[PaymentStatusEnum.successful];
  }
  else if (status === PaymentStatusEnum.failed) {
    return statsObject[PaymentStatusEnum.failed];
  }
  else if (status === PaymentStatusEnum.cancelled) {
    return statsObject[PaymentStatusEnum.cancelled]
  }
  else if (status == PaymentStatusEnum.refunded || status === PaymentStatusEnum.partially_refunded) {
    return statsObject[PaymentStatusEnum.refunded] + statsObject[PaymentStatusEnum.partially_refunded];
  }
  else if (status === PaymentStatusEnum.pending  || status === PaymentStatusEnum.refund_pending) {
    return statsObject[PaymentStatusEnum.pending] + statsObject[PaymentStatusEnum.refund_pending];
  }
  return 0;
}
