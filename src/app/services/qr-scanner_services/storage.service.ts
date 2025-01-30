import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {apiEnviroment} from '@ingenium/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private storageModule: string = "production"

  constructor(private storage: Storage) {
    this.init().then();
    if (apiEnviroment.name === "development") {
      this.storageModule = "development"
    }
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public set(key: string, value: any) { // {dictKey: string, dictValue: any}
    // this._storage?.set(key, value);
    let dictKey: any = Object.keys(value)
    dictKey = dictKey[0]
    let dictValue: any = value[dictKey]
    this._storage?.get(this.storageModule).then((result) => {
      if (result !== undefined && result !== null) {
        let edit = result[key]
        if (edit === undefined) {
          result[key] = value
        } else {
          edit[dictKey] = dictValue
        }
        this._storage?.set(this.storageModule, result).then()
      } else {
        let dict: any = {}
        dict[key] = value
        this._storage?.set(this.storageModule, dict).then()
      }
    })
  }

  public setWide(key: string, value:string) {
    this._storage?.set(key, value);
  }

  public get(key: string) {
    // return this._storage?.get(key).then((result) => {
    //   return result
    // })
    return this._storage?.get(this.storageModule).then((result) => {
      if (result === null || result === undefined) {
        return undefined
      } else {
        result = result as {}
        return result[key]
      }
    });
  }

  public getWide(key: string) {
    return this._storage?.get(key).then((result) => {
      return result
    })
  }

  public reset() {
    // this._storage?.clear().then()
    this._storage?.remove(this.storageModule)
  }

  public resetWide() {
    this._storage?.clear()
  }

  public clearSpecific(key: string) {
    // this._storage?.remove(key).then()
    let newStore
    this._storage?.get(this.storageModule).then((result) => {
      delete result[key]
      newStore = result
    });
    this._storage?.set(this.storageModule, newStore)
  }

}
