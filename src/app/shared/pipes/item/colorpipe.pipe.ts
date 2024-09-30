import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colordbrgba',
  standalone: true,
})
export class ColordbrgbaPipe implements PipeTransform {

  transform(db_color: string, _a: number): string {
    return db_color;
  }

}
