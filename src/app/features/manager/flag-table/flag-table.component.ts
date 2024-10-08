import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {Observable} from 'rxjs';

interface FlagI {
  id: number
  name: string
  value: object
}

@Component({
  selector: 'app-flag-table',
  templateUrl: './flag-table.component.html',
  styleUrls: ['./flag-table.component.css']
})
export class FlagTableComponent {

  loading: boolean = false;

  constructor(private httpClient: HttpClient) {
  }

  $checkoutsEnabled: Observable<FlagI> = this.httpClient.get<FlagI>(apiEnviroment.apiUrl + 'flag?name=checkouts_enabled');

  public toggleCheckoutEnable(flagObj: FlagI) {
    this.loading = true;

    // Syntax is -> value = condition ? v_true: v_false
    // @ts-expect-error I don't know cuz I did not write this...
    const flagValue = flagObj.value["checkouts_enabled"] == 1 ? {"checkouts_enabled": 0}: {"checkouts_enabled": 1};

    const putFlag: FlagI = {
      id: flagObj.id,
      name: flagObj.name,
      value: flagValue,
    };

    this.$checkoutsEnabled = this.httpClient.put<FlagI>(
      apiEnviroment.apiUrl + 'manager/flag?name=checkouts_enabled',
      putFlag
    );
    this.loading = false;
  }

}
