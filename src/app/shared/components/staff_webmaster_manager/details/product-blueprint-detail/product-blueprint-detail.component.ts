import {Component, Input} from '@angular/core';
import {StaffProductBlueprintI} from "../../../../models/staff/staff_productblueprint";

@Component({
  selector: 'app-product-blueprint-detail',
  templateUrl: './product-blueprint-detail.component.html',
  styleUrls: ['./product-blueprint-detail.component.css'],
  standalone: true
})
export class ProductBlueprintDetailComponent {
  @Input() productBlueprint!: StaffProductBlueprintI

}
