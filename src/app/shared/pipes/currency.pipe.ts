import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencypipe',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(amount: string, currency: string): string {
    switch (currency) {
    case 'EUR': return '€ ' + amount.toString() + ' ' + currency;
    default: return 'ERROR: Unknown Currency ' + currency;
    }
  }
}
