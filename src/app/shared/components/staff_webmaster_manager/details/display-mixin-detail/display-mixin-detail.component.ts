import {Component, Input} from '@angular/core';
import {StaffDisplayMixin} from "../../../../models/staff/staff_item_details";

@Component({
  selector: 'app-display-mixin-detail',
  templateUrl: './display-mixin-detail.component.html',
  styleUrls: ['./display-mixin-detail.component.css'],
  standalone: true
})
export class DisplayMixinDetailComponent {

  @Input() displayMixin!: StaffDisplayMixin;

}
