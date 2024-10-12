import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {StatusStatsI} from "@ingenium/app/shared/models/stats/transactionStats";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {ValidityEnum} from "@ingenium/app/shared/models/transaction/validityEnum";
import {TransactionI, TransactionPatchI} from "@ingenium/app/shared/models/transaction/transactionModels";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'transaction';

  public queryTransactions(offset: number = 0, count: number = 50,
                           item: number | null = null,
                           user: string | null = null,
                           interaction_id: number | null,
                           status: PaymentStatusEnum | null = null,
                           validity: ValidityEnum | null = null,
                           checkout_uuid: string | null = null,
                           blueprint_id: number | null = null,
                           blueprint: string | null = null,
                           price_policy_id: number | null,
                           price_policy: string | null = null): Observable<TransactionI[]> {
    const param = {
      offset: offset,
      limit: count,
      item: item,
      user: user,
      interaction_id: interaction_id,
      transaction_status: status,
      validity: validity,
      checkout_uuid: checkout_uuid,
      product_blueprint_id: blueprint_id,
      blueprint: blueprint,
      price_policy_id: price_policy_id,
      price_policy: price_policy
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<TransactionI[]>(`${this.apiUrl}?${params.toString()}`);
  }



  public transactionCountGroupByStatus(item: number | null = null,
                                       user: string | null = null,
                                       interaction_id: number | null,
                                       status: PaymentStatusEnum | null = null,
                                       validity: ValidityEnum | null = null,
                                       checkout_uuid: string | null = null,
                                       blueprint_id: number | null = null,
                                       blueprint: string | null = null,
                                       price_policy_id: number | null,
                                       price_policy: string | null = null): Observable<StatusStatsI> {
    const param = {
      item: item,
      user: user,
      interaction_id: interaction_id,
      transaction_status: status,
      validity: validity,
      checkout_uuid: checkout_uuid,
      product_blueprint_id: blueprint_id,
      blueprint: blueprint,
      price_policy_id: price_policy_id,
      price_policy: price_policy
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<StatusStatsI>(`${this.apiUrl}/group_by?${params.toString()}`);
  }

  public getTransactionsExport(fields: string[],
                               item: number | null = null,
                               user: string | null = null,
                               interaction_id: number | null,
                               status: PaymentStatusEnum | null = null,
                               validity: ValidityEnum | null = null,
                               checkout_uuid: string | null = null,
                               blueprint_id: number | null = null,
                               blueprint: string | null = null,
                               price_policy_id: number | null,
                               price_policy: string | null = null): Observable<Blob> {
    const param = {
      // TODO Fields
      item: item,
      user: user,
      interaction_id: interaction_id,
      transaction_status: status,
      validity: validity,
      checkout_uuid: checkout_uuid,
      product_blueprint_id: blueprint_id,
      blueprint: blueprint,
      price_policy_id: price_policy_id,
      price_policy: price_policy
    }

    const httpOptions: object = {
      responseType: ('blob' as 'application/vnd.ms-excel')
    };

    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<Blob>(`${this.apiUrl}/export?${params.toString()}`, httpOptions);
  }

  public patchTransaction(interaction_id: number, patchObj: TransactionPatchI, forcePatch: boolean = false) {
    return this.httpClient.patch<TransactionI>(`${this.apiUrl}/${interaction_id}?force_patch=${String(forcePatch)}`, patchObj);
  }

  public emailTransaction(interaction_id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/email/${String(interaction_id)}`);
  }
}
