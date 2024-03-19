import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'eventdate'
})
export class EventdatePipe extends DatePipe implements PipeTransform {
  override transform(value: any, ...args: unknown[]): any {
    return super.transform(value);
  }
}
