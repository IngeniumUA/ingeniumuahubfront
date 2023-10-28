import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../environments/environment";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent {

  constructor(private httpClient: HttpClient) {
  }

  public failSafe() {
    this.httpClient.get(apiEnviroment.apiUrl + "staff/functions/failsafe").subscribe()
  }

}
