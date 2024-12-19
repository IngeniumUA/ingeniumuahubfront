import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AccessKeyI, AllowDenyListI} from "@ingenium/app/shared/models/access_policies/accessPolicyI";
import {AccessPolicyI} from "@ingenium/app/shared/models/item/availabilityCompositionI";

@Component({
  selector: 'app-access-key',
  standalone: true,
  imports: [],
  templateUrl: './access-key.component.html',
  styleUrl: './access-key.component.scss'
})
export class AccessKeyComponent {
  @Input() access_policy_content!: AccessKeyI | null;
  @Output() UpdateAccessPolicy = new EventEmitter<AccessPolicyI>;
}
