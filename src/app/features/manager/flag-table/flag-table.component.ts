import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../environments/environment";
import {Observable} from "rxjs";

interface FlagI {
  id: number
  name: string
  int_value: number
}

@Component({
  selector: 'app-flag-table',
  templateUrl: './flag-table.component.html',
  styleUrls: ['./flag-table.component.css']
})
export class FlagTableComponent {

  loading: boolean = false

  constructor(private httpClient: HttpClient) {
  }

  $checkoutsEnabled: Observable<FlagI> = this.httpClient.get<FlagI>(apiEnviroment.apiUrl + "manager/flag?name=checkouts_enabled");

  public toggleCheckoutEnable(flagObj: FlagI) {
    this.loading = true

    // Syntax is -> value = condition ? v_true: v_false
    const putFlag: FlagI = {
      id: flagObj.id,
      name: flagObj.name,
      int_value: flagObj.int_value == 1 ? 0: 1
    }

    this.$checkoutsEnabled = this.httpClient.put<FlagI>(
        apiEnviroment.apiUrl + "manager/flag?name=checkouts_enabled",
        putFlag
    );
    this.loading = false
  }

}
