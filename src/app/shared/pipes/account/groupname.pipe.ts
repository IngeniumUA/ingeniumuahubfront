import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'eventdate' })
export class GroupnamePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
    case 1: return 'Manager';
    case 2: return 'Webmaster';
    case 3: return 'Staff';
    default: return 'ERROR: Unknown GroupID';
    }
  }
}
