import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {apiEnviroment} from "@ingenium/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {AsNotificationItemWide} from "@ingenium/app/shared/pipes/item/itemWidePipes";

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
              private httpClient: HttpClient) {
  }

  notifications$: Observable<ItemWideI[]> = of([]);
  notificationForm: any;
  sendBuffer: boolean = false;
  form_error: string | null = null;

  ngOnInit() {
    this.notificationForm = this.formBuilder.group({
      topic: ['all', Validators.required],
      title: ['', Validators.required],
      body: ['', Validators.required],
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
    this.sendNotification(
      this.notificationForm.controls['topic'].value,
      this.notificationForm.controls['title'].value,
      this.notificationForm.controls['body'].value)
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  private sendNotification(notification_item_topic: string,
                          title: string,
                          body: string) {
    const param = {
      title: title,
      body: body
    }
    this.httpClient.post(`${apiEnviroment.apiUrl}item/wide/notification/${notification_item_topic}/send_notification`, param);
  }
}
