import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";
import {apiEnviroment} from "@ingenium/environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-app-notifications',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './app-notifications.component.html',
  styleUrl: './app-notifications.component.scss'
})
export class AppNotificationsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient) {
  }

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

  private sendNotification(topic: string,
                          title: string,
                          body: string) {
    const param = {
      topic: topic,
      title: title,
      body: body
    }
    const params = new URLSearchParams(removeNull(param));
    this.httpClient.post(`${apiEnviroment.apiUrl}app_notification/send_notification?`, params);
  }

}
