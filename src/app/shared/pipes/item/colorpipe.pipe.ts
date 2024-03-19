import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colordbrgba',
  standalone: true,
})
export class ColordbrgbaPipe implements PipeTransform {

  transform(db_color: string, a: number): string {
    return 'rgba('
    + db_color.substring(0, 3) + ', '
    + db_color.substring(3, 6) + ', '
    + db_color.substring(6, 9) + ', '
    + a.toString() + ')';
  }

}
