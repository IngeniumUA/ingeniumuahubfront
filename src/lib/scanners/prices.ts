import { StorageService } from '$lib/scanners/storage.ts';
import { eventDict } from '$lib/scanners/get-events.ts';


export class PricesService {

	constructor(private storage: StorageService) {
		this.setupPrices()
	}

	public setupPrices() {
		const uuids: any = Object.values(eventDict)

		const PriceDictKeys = Object.keys(PriceDict)
		for (const id of uuids) {
			if (!PriceDictKeys.includes(id)) {
				PriceDict[id] = -1
				const storageDict: any = {}
				storageDict[id] = -1
				this.storage.setStorage("prices", storageDict)
			}
		}

		this.storage.getStorage("prices")?.then((result: any) => {
			if (result !== undefined) {
				PriceDict = result;
			}
		});
	}

}

export let PriceDict: any = {}