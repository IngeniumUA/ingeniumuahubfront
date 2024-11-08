import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";

@Component({
  selector: 'app-staff-event-edit',
  templateUrl: './staff-event-edit.component.html',
  styleUrls: ['./staff-event-edit.component.css'],
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})
export class StaffEventEditComponent implements OnInit {
  @Input() event!: ItemWideI;
  form!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    this.setForm();
  }

  // Form methods
  public setForm(): void {
    if ("event_start" in this.event.derived_type) {
      this.form = this.formBuilder.group({
        name: [this.event.item.name, Validators.required],
        description: [this.event.item.description, Validators.required],
        start_date: [this.event.derived_type.event_start, Validators.required],
        end_date: [this.event.derived_type.event_end, Validators.required],
        // location: [this.event.location, Validators.required],
        follow_through_link: [this.event.derived_type.display.follow_through_link, Validators.required],
        color: [this.event.derived_type.display.color, Validators.required],
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {

  }
}
