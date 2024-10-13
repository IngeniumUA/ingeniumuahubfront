import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colordbrgba',
  standalone: true,
})
export class ColordbrgbaPipe implements PipeTransform {

  transform(db_color: string, _a: number = 1): string {
    const stripped = db_color.replace(/[ ()]|rgb/g, '');
    const split = stripped.split(',', 3)
    return `rgba(${split[0]}, ${split[1]}, ${split[2]}, ${_a.toString()})`;
  }

}
