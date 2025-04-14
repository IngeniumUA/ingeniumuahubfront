import { PUBLIC_API_URL } from '$env/static/public';
import {CapacitorHttp} from "@capacitor/core";
import { getTokens } from '$lib/auth/auth.ts';


export class CheckUserService {
	private returnMsg: string | any = "startMsg"

	async checkUser(userEmail: string) {

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/user?limit=50&offset=0&user=" + userEmail.replace("@", "%40"),
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options);

			if (response.status === 200) {
				const responseDict: any = {}
				const jsonResponse = await response.data
				responseDict["lid"] = jsonResponse[0]["roles"]["is_lid"]
				responseDict["uuid"] = jsonResponse[0]["user_uuid"]
				this.returnMsg = responseDict
			} else if (response.status === 404) {
				this.returnMsg = "user_not_found"
			}

		} catch (error) {
			console.log(error)
			this.returnMsg = "server_error"
		}

		return this.returnMsg

	}
}