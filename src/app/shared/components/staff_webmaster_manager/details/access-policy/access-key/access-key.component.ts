import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccessKeyI} from "@ingenium/app/shared/models/access_policies/accessPolicyI";
import {AccessPolicyI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidURLCharacters} from "@ingenium/app/shared/validators/ValidUrlCharacters";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-access-key',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './access-key.component.html',
  styleUrl: './access-key.component.scss'
})
export class AccessKeyComponent implements OnInit {
  @Input() access_policy_content!: AccessKeyI | null;
  @Output() UpdateAccessPolicy = new EventEmitter<AccessPolicyI>;

  form!: any;

  constructor(private formBuilder: FormBuilder) {}

  defaultValue(accessKey: AccessKeyI | null): string {
    if (accessKey === null) {
      return "Default"
    }
    if (accessKey.access_key === null) {
      return "Default"
    }
    return accessKey.access_key;
  }


  ngOnInit() {
    this.form = this.formBuilder.group({
      access_key: [this.defaultValue(this.access_policy_content), [Validators.required, ValidURLCharacters()]],
    })

    this.form.valueChanges.subscribe((val: AccessKeyI) => {
      this.access_policy_content = {
        access_key: val.access_key,
      };
      const content: AccessPolicyI = {
        access_policy_config: this.access_policy_content
      }
      console.log(content);
      this.UpdateAccessPolicy.emit(content)
    })
  }
}
