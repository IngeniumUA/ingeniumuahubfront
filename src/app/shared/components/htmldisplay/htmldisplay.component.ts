import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-htmldisplay',
  templateUrl: './htmldisplay.component.html',
  // styleUrls: ['./htmldisplay.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class HTMLDisplayComponent {

  @Input() html!: string;
}
