import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {AsNotificationItemWide} from "@ingenium/app/shared/pipes/item/itemWidePipes";
import {NotificationService} from "@ingenium/app/core/services/coreAPI/item/derived_services/notification.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-app-notifications',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    AsNotificationItemWide
  ],
  templateUrl: './app-notifications.component.html',
  styleUrl: './app-notifications.component.scss'
})
export class AppNotificationsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private toastrService: ToastrService) {
  }

  notifications$: Observable<ItemWideLimitedI[]> = this.notificationService.queryNotification();
  notificationForm: any;
  sendBuffer: boolean = false;
  form_error: string | null = null;

  ngOnInit() {
    this.notificationForm = this.formBuilder.group({
      item_id: ['', Validators.required],
      title: ['', Validators.required],
      body: ['', Validators.required],
      data: ['', Validators.pattern('/({(("[A-Za-z0-9_-]+?"|\'[A-Za-z0-9_-]+?\'): ?("[A-Za-z0-9_-]+?"|\'[A-Za-z0-9_-]+?\'),{1} ?)*(("[A-Za-z0-9_-]+?"|\'[A-Za-z0-9_-]+?\'): ?("[A-Za-z0-9_-]+?"|\'[A-Za-z0-9_-]+?\'))})|(^$)/gm')],
    });
  }

  onSubmit() {
    // First press toggles "are you sure?"
    if (! this.sendBuffer) {
      this.sendBuffer = true;
      return;
    }
    this.sendBuffer = false;

    // Second press sends notification
    this.notificationService.sendNotification(
      this.notificationForm.controls['item_id'].value,
      this.notificationForm.controls['title'].value,
      this.notificationForm.controls['body'].value,
      JSON.parse(this.notificationForm.controls['data'].value)).subscribe(
      (_) => {
        this.toastrService.success('Notification sent successfully');
      },
      (error: Error) => {
        this.toastrService.error(`Notification failed to send: ${error.message}`);
      });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }
}
