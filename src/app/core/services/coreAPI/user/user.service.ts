import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {Observable} from "rxjs";
import {UserI, UserWideI} from "@ingenium/app/shared/models/user/userI";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'user';

  public syncWithKeycloak(user: string): Observable<UserI> {
    return this.httpClient.post<any>(`${apiEnviroment.apiUrl}user/sync_with_keycloak/${user}`, {});
  }

  public queryUsers(offset: number = 0, count: number = 50,
                    user: string | null = null,
                    groups: number[] | null = null
  ): Observable<UserI[]> {
    const param = {
      offset: offset,
      limit: count,
      user: user,
      group: groups
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<UserI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public getUserCount(user: string | null = null, groups: number[] | null = null
  ): Observable<number> {
    const param = {
      user: user,
      group: groups
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`);
  }

  public getUserWide(userUUID: string): Observable<UserWideI> {
    return this.httpClient.get<UserWideI>(`${this.apiUrl}/wide/${userUUID}`);
  }

  public patchWide(userUUID: string, patch_obj: any): Observable<UserWideI> {
    return this.httpClient.patch<UserWideI>(`${this.apiUrl}/wide/${userUUID}`, patch_obj);
  }

  public getUsersExport( // fields: string[],
                        user: string | null = null,
                        groups: number[] = []):
    Observable<any>{
    const param = {
      user: user,
      group: groups
    }
    const httpOptions: object = {
      responseType: ('blob' as 'application/vnd.ms-excel')
    };

    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<Blob>(`${this.apiUrl}/export?${params.toString()}`, httpOptions);
  }

  public importUsers(file: FormData, group_id: number | null = null): Observable<boolean> {
    const param = {
      add_to_group: group_id
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.post<boolean>(`${this.apiUrl}/import?${params.toString()}`, file);
  }
}
