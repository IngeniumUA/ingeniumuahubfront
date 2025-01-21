import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
    name: 'EventDate',
    standalone: false
})
export class EventDatePipe extends DatePipe implements PipeTransform {
  override transform(value: any): any {
    return super.transform(value);
  }
}
