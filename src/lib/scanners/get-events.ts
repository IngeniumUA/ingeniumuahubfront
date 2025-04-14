import { PUBLIC_API_URL } from '$env/static/public';
import {CapacitorHttp} from "@capacitor/core";
import { getTokens } from '$lib/auth/auth.ts';


export class GetEventsService {
	private returnMsg: string = "startMsg"

	async getEvents() {
		const currentDate: Date = new Date(Date.now())

		let day: number = currentDate.getDate() - 1
		let month: number = currentDate.getMonth() + 1
		let year: number = currentDate.getFullYear()
		const monthDayArr: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		if (day === 0) {
			month = month - 1
			day = monthDayArr[month-1]
		}
		if (month === 0) {
			month = 12
			year = year - 1
		}

		const yearMonthDayString: string = year.toString()+"-"+('00'+month.toString()).slice(-2)+"-"+('00'+day.toString()).slice(-2)
		const dateString: string = "&event_end_ge=" + yearMonthDayString

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/item/event/?limit=50&offset=0" + dateString,
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options)
			console.log(JSON.stringify(response))

			if (response.status === 200) {
				const returnDict: any = {}
				const jsonResponse = await response.data
				for (const event of jsonResponse) {
					if (event["derived_type"]["derived_type_enum"] == "eventitem") {
						returnDict[event["item"]["name"]] = "" + event["item"]["id"]
					}
				}
				returnDict['Alle evenementen'] = "alle"
				eventDict = returnDict;
				console.log("events: " + JSON.stringify(returnDict));
				this.returnMsg = "success"
			} else {this.returnMsg = response.status.toString()}

		} catch (error) {
			console.log(error)
			this.returnMsg = "server_error"
		}

		return this.returnMsg

	}

	public async getEventStats(itemId: number): Promise<string> {
		const requestString: string = "?&validity=5&item=" + itemId  // 5 is consumed in the enum

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/transaction/group_by" + requestString,
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options)

			if (response.status === 200) {
				const jsonResponse = await response.data
				this.returnMsg = jsonResponse["1"] as string  // 1 is successful in the enum
			}

		} catch (error) {
			console.log(error)
			this.returnMsg = "server_error"
		}

		return this.returnMsg

	}

	setEvent(event: string) {
		selectedEvent = event
	}

}

export let eventDict: any = {};
export let selectedEvent: any = "";