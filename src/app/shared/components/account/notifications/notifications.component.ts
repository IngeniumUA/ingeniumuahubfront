import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {NotificationService} from "@ingenium/app/core/services/coreAPI/item/derived_services/notification.service";
import {AsNotificationItemWide} from "@ingenium/app/shared/pipes/item/itemWidePipes";
import {NgForOf} from "@angular/common";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {LoadingIndicatorComponent} from "@ingenium/app/shared/components/loading-indicator/loading-indicator.component";
import {StorageService} from "@app_services/qr-scanner_services/storage.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  imports: [
    ReactiveFormsModule,
    AsNotificationItemWide,
    NgForOf,
    LoadingIndicatorComponent
  ],
  standalone: true
})
export class NotificationsComponent  implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private storage: StorageService,
              private notificationService: NotificationService) { }

  notificationList: ItemWideLimitedI[] = [];
  loading_options = true

  public ionViewWillEnter() {
    this.ngOnInit()
  }

  ngOnInit() {
    this.notificationService.queryNotification().pipe(first()).subscribe({
      next: data => {
        let final_data: ItemWideLimitedI[] = []
        this.loading_options = false
        let form_data: any = {disable_notifications: [false, Validators.required]}

        for (let notification of data) {
          if (notification.item.name !== "Notify Everyone") {
            final_data.push(notification);
            form_data["" + notification.item.id] = [false, Validators.required]
          }
        }
        this.form = this.formBuilder.group(form_data);

        this.notificationList = final_data

        this.storage.getWide("notifications_general")?.then((result) => {
          if (result !== undefined && result !== null) {
            let bool_result: boolean = result === "true"
            this.form.controls["disable_notifications"].setValue(bool_result)
            if (bool_result) {
              for (let notification of this.notificationList) {
                this.form.controls[""+notification.item.id].disable()
              }
            } else {
              for (let notification of this.notificationList) {
                this.form.controls[""+notification.item.id].enable()
              }
            }
          }
        })
        this.storage.getWide("notifications")?.then((stored_notification_options) =>{
          if (stored_notification_options !== undefined && stored_notification_options !== null) {
            stored_notification_options = JSON.parse(stored_notification_options);
            let stored_option: keyof typeof stored_notification_options;
            for (stored_option in stored_notification_options) {
              for (let fetched_option of this.notificationList) {
                if (stored_option === "" + fetched_option.item.id) {
                  this.form.controls[stored_option].setValue(stored_notification_options[stored_option])
                }
              }
            }
          }
        });
      }
    })
  }

  all_notifications_clicked() {
    if (this.form.controls['disable_notifications'].value) {
      for (let notification of this.notificationList) {
        this.form.controls[""+notification.item.id].enable()
      }
    } else {
      for (let notification of this.notificationList) {
        this.form.controls[""+notification.item.id].disable()
      }
    }
  }

  onSubmit() {
    if (this.loading) return;
    this.form.markAllAsTouched();

    // Check if valid guard clause
    if (this.form.invalid) {
      this.toastr.error('Ongeldig formulier!', 'Fout');
      return;
    }

    this.loading = true;
    let notificationDetails: any = {}
    for (let notification of this.notificationList) {
      if (notification.item.name === "Notify Everyone") {
        const index = this.notificationList.indexOf(notification, 0);
        if (index > -1) {
          this.notificationList.splice(index, 1);
        }
      } else {
        notificationDetails["" + notification.item.id] = this.form.controls[""+notification.item.id].value
      }
    }
    this.storage.setWide("notifications", JSON.stringify(notificationDetails))
    this.storage.setWide("notifications_general", JSON.stringify(this.form.controls['disable_notifications'].value))

    let option: keyof typeof notificationDetails;
    if (this.form.controls['disable_notifications'].value) {
      this.notificationService.unsubscribe_from_topic("11").subscribe()
      for (option in notificationDetails) {
        this.notificationService.unsubscribe_from_topic(option).subscribe()
      }
    } else {
      this.notificationService.subscribe_to_topic("11").subscribe()
      for (option in notificationDetails) {
        if (notificationDetails[option]) {
          this.notificationService.subscribe_to_topic(option).subscribe()
        } else {
          this.notificationService.unsubscribe_from_topic(option).subscribe()
        }
      }
    }

    this.loading = false;
  }

}
