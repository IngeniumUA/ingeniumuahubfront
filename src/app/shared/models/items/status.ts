export interface StatusI {
    name: string
    value: string
}

export const StatusOptions: StatusI[] = [
  {value: 'SUCCESSFUL', name: 'SUCCESSFUL'},
  {value: 'PENDING', name: 'PENDING'},
  {value: 'CANCELLED', name: 'CANCELLED'},
  {value: 'FAILED', name: 'FAILED'},
  {value: 'REFUND_PENDING', name: 'REFUND_PENDING'},
  {value: 'REFUNDED', name: 'REFUNDED'},
];
