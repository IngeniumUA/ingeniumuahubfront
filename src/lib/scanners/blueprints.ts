import { PUBLIC_API_URL } from '$env/static/public';
import { AppStorage } from '$lib/scanners/storage.ts';
import { CapacitorHttp } from '@capacitor/core';
import { eventDict, selectedEvent } from './get-events';
import { getTokens } from '$lib/auth/auth.ts';


export class BlueprintsService {
	private returnMsg: string = "startMsg"

	constructor() {
		AppStorage.getStorage("blueprints")?.then((result) => {
			if (result !== undefined) {
				blueprintsDict = result
			}
		})
	}

	async getBlueprints(): Promise<string> {

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/blueprint?limit=50&offset=0&source_item_id=" + eventDict[selectedEvent],
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options);

			if (response.status === 200) {
				const jsonResponse = await response.data
				const trueDict: any = {}
				for (const item of jsonResponse) {
					if (blueprintsDict[selectedEvent] === undefined) {
						blueprintsDict[selectedEvent] = {}
					}
					if (blueprintsDict[selectedEvent][item["name"]] === undefined) {
						trueDict[item["name"]] = true
					} else {
						trueDict[item["name"]] = blueprintsDict[selectedEvent][item["name"]]
					}
				}
				blueprintsDict[selectedEvent] = trueDict
				this.returnMsg = "success"
			}

		} catch (error) {
			console.log(error)
			this.returnMsg = "server_error"
		}

		return this.returnMsg

	}

	dictSetter(dict: any, event: string) {
		blueprintsDict[event] = dict
		AppStorage.setStorage("blueprints", blueprintsDict)
	}

}

export let blueprintsDict: any = {}