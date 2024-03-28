export interface ValidityI {
    name: string
    value: number
}

export const ValidityOptions: ValidityI[] = [
  {value: 0, name: 'forbidden'},
  {value: 1, name: 'valid'},
  {value: 2, name: 'invalid'},
  {value: 3, name: 'manually_verified'},
  {value: 4, name: 'consumed'}
];
