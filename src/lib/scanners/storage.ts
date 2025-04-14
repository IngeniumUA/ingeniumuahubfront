import { PUBLIC_SENTRY_ENVIRONMENT } from '$env/static/public';
import { browser } from '$app/environment';
import { Storage } from '@ionic/storage';


export class StorageService {
	private _storage: Storage | null = null;
	private storageModule: string = "production"

	constructor() {
		if (browser) {
			this.init()
		}
	}

	private async init() {
		const store = new Storage();
		this._storage = await store.create();

		if (PUBLIC_SENTRY_ENVIRONMENT === 'development') {
			this.storageModule = 'development';
		}
	}

	public setStorage(key: string, value: any) { // {dictKey: string, dictValue: any}
		if (!browser) {return}
		// this._storage?.set(key, value);
		let dictKey: any = Object.keys(value)
		dictKey = dictKey[0]
		const dictValue: any = value[dictKey]
		this._storage?.get(this.storageModule).then((result) => {
			if (result !== undefined && result !== null) {
				const edit = result[key]
				if (edit === undefined) {
					result[key] = value
				} else {
					edit[dictKey] = dictValue
				}
				this._storage?.set(this.storageModule, result).then()
			} else {
				const dict: any = {}
				dict[key] = value
				this._storage?.set(this.storageModule, dict).then()
			}
		})
	}

	public setWide(key: string, value:string) {
		if (!browser) {return}
		this._storage?.set(key, value);
	}

	public getStorage(key: string) {
		if (!browser) {return}
		// return this._storage?.get(key).then((result) => {
		//   return result
		// })
		return this._storage?.get(this.storageModule).then((result) => {
			if (result === null || result === undefined) {
				return undefined
			} else {
				result = result as object
				return result[key]
			}
		});
	}

	public getWide(key: string) {
		if (!browser) {return}
		return this._storage?.get(key).then((result) => {
			return result
		})
	}

	public reset() {
		if (!browser) {return}
		// this._storage?.clear().then()
		this._storage?.remove(this.storageModule)
	}

	public resetWide() {
		if (!browser) {return}
		this._storage?.clear()
	}

	public clearSpecific(key: string) {
		if (!browser) {return}
		// this._storage?.remove(key).then()
		let newStore
		this._storage?.get(this.storageModule).then((result) => {
			delete result[key]
			newStore = result
		});
		this._storage?.set(this.storageModule, newStore)
	}

}


// export class StorageServiceP {
// 	private storageModule: string = "production"
//
// 	constructor() {
// 		if (PUBLIC_SENTRY_ENVIRONMENT === "development") {
// 			this.storageModule = "development"
// 		}
// 	}
//
// 	public setStorage(key: string, value: any) { // {dictKey: string, dictValue: any}
// 		if (!browser) {return}
// 		// this._storage?.set(key, value);
// 		let dictKey: any = Object.keys(value)
// 		dictKey = dictKey[0]
// 		const dictValue: any = value[dictKey]
// 		Preferences.get({key: this.storageModule}).then(({value: result_string}) => {
// 			if (result_string !== undefined && result_string !== null) {
// 				const result = JSON.parse(result_string)
// 				if (result === null) {return}
// 				const edit = result[key]
// 				if (edit === undefined) {
// 					result[key] = value
// 				} else {
// 					edit[dictKey] = dictValue
// 				}
// 				Preferences.set({key: this.storageModule, value: result}).then()
// 			} else {
// 				const dict: any = {}
// 				dict[key] = value
// 				Preferences.set({key: this.storageModule, value: dict}).then()
// 			}
// 		})
// 	}
//
// 	public setWide(key: string, value:string) {
// 		if (!browser) {return}
// 		Preferences.set({key: key, value: value}).then();
// 	}
//
// 	public getStorage(key: string) {
// 		if (!browser) {return}
// 		// return this._storage?.get(key).then((result) => {
// 		//   return result
// 		// })
// 		return Preferences.get({key: this.storageModule}).then(({value: result_string}) => {
// 			if (result_string === null || result_string === undefined) {
// 				return undefined
// 			} else {
// 				const result = JSON.parse(result_string)
// 				if (result === null || result === undefined) {return}
// 				return result[key]
// 			}
// 		});
// 	}
//
// 	public getWide(key: string) {
// 		if (!browser) {return}
// 		return Preferences.get({key: key}).then(({value: result}) => {
// 			return result
// 		})
// 	}
//
// 	public reset() {
// 		if (!browser) {return}
// 		// this._storage?.clear().then()
// 		Preferences.remove({key: this.storageModule}).then()
// 	}
//
// 	public resetWide() {
// 		if (!browser) {return}
// 		Preferences.clear().then()
// 	}
//
// 	public clearSpecific(key: string) {
// 		if (!browser) {return}
// 		// this._storage?.remove(key).then()
// 		let newStore = ""
// 		Preferences.get({key: this.storageModule}).then(({value: result_string}) => {
// 			if (result_string === null || result_string === undefined) {return}
// 			const result = JSON.parse(result_string)
// 			if (result === null || result === undefined) {return}
// 			delete result[key]
// 			newStore = result
// 	});
// 		Preferences.set({key: this.storageModule, value: newStore}).then()
// 	}
//
// }

export const AppStorage: StorageService = new StorageService()

export let doAutoReturn: boolean = false
export let disableSound: boolean = false
export let returnTime: number = 1

export function setAutoReturnValue(value: boolean) {
	doAutoReturn = value;
}
export function setdisableSoundValue(value: boolean) {
	disableSound = value;
}
export function setreturnTime(value: number) {
	returnTime = value;
}
