import { PUBLIC_API_URL } from '$env/static/public';
import {CapacitorHttp} from "@capacitor/core";
import { getTokens } from '$lib/auth/auth.ts';


export class TransactionPatcherService {
	private returnMsg: string = "startMsg"

	async PatchTransaction(interactionID: number, validity: string = "", user: string = "") {
		const data: any = {}
		if (validity !== "") {
			let validityEnum: number = 1
			if (validity === "forbidden") {validityEnum = 1}
			if (validity === "valid") {validityEnum = 2}
			if (validity === "invalid") {validityEnum = 3}
			if (validity === "manually_verified") {validityEnum = 4}
			if (validity === "consumed") {validityEnum = 5}
			data["validity"] = validityEnum}
		if (user !== "") {data["interaction"] = {"user": user}}

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/transaction/" + interactionID.toString() + "?force_patch=true",
				data: data,
				headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': "application/json"}
			}
			const response = await CapacitorHttp.patch(options);

			if (response.status === 200) {
				console.log("success")
				this.returnMsg = "success"
			} else {
				console.log(response.status)
				console.log(JSON.stringify(response.data))
			}

		} catch (error) {
			console.log(error)
			this.returnMsg = "server_error"
		}

		return this.returnMsg

	}

}