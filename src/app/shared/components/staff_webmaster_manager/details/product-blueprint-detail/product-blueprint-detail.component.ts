import {Component, Input} from '@angular/core';
import {StaffProductBlueprintI} from "../../../../models/staff/staff_productblueprint";
import {DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-product-blueprint-detail',
  templateUrl: './product-blueprint-detail.component.html',
  styleUrls: ['./product-blueprint-detail.component.css'],
  imports: [
    DatePipe,
    RouterLink
  ],
  standalone: true
})
export class ProductBlueprintDetailComponent {
  @Input() productBlueprint!: StaffProductBlueprintI
}
