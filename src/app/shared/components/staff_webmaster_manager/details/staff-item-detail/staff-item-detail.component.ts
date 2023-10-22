import {Component, Input} from '@angular/core';
import {StaffItemDetailI} from "../../../../models/staff/staff_item_details";
import {NgIf} from "@angular/common";
import {DisplayMixinDetailComponent} from "../display-mixin-detail/display-mixin-detail.component";

@Component({
  selector: 'app-staff-item-detail',
  templateUrl: './staff-item-detail.component.html',
  styleUrls: ['./staff-item-detail.component.css'],
  imports: [
    NgIf,
    DisplayMixinDetailComponent
  ],
  standalone: true
})
export class StaffItemDetailComponent {

  @Input() item!: StaffItemDetailI

}
