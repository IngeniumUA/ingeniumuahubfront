import { PUBLIC_API_URL } from '$env/static/public';
import {CapacitorHttp} from "@capacitor/core";
import { getTokens } from '$lib/auth/auth.ts';

export class PostInteractionService {

	userReturnMsg: string = ""
	interactionExistsMsg: boolean | string = ""
	creationReturnMsg: string = ""

	async processInteraction(card_uuid:string, event_id: number) {
		const user_uuid = await this.getUserUUIDFromCard(card_uuid)
		if (user_uuid !== "server_error") {
			const interaction_exists = await this.doesInteractionExist(user_uuid, event_id)
			if (typeof interaction_exists === "boolean") {
				if (interaction_exists) {
					return "interaction_exists"
				} else {
					return await this.createInteraction(user_uuid, event_id)
				}
			} else {
				return interaction_exists
			}
		} else {
			return user_uuid
		}
	}

	async getUserUUIDFromCard(card_uuid: string) {

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/card/" + card_uuid,
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options);

			if (response.status === 200) {
				const jsonResponse = await response.data
				this.userReturnMsg = jsonResponse["user_uuid"]
			}

		} catch (error) {
			console.log(error)
			this.userReturnMsg = "server_error"
		}

		return this.userReturnMsg

	}

	async doesInteractionExist(user_uuid: string, event_id: number) {
		const query_params: string = "&user=" + user_uuid + "&item=" + event_id

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/interaction?limit=100&offset=0&interaction_type=1201" + query_params,
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options);

			if (response.status === 200) {
				const jsonResponse = await response.data
				this.interactionExistsMsg = jsonResponse.length !== 0
			}

		} catch (error) {
			console.log(error)
			this.interactionExistsMsg = "server_error"
		}

		return this.interactionExistsMsg

	}

	async createInteraction(user_uuid: string, event_id: number) {
		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/interaction",
				headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': "application/json"},
				data: {
					item_id: event_id,
					user_uuid: user_uuid,
					interaction_type: 1201
				},
			}
			const response = await CapacitorHttp.post(options);

			if (response.status === 200) {
				await response.data;
				this.creationReturnMsg = "success"
			}

		} catch (error) {
			console.log(error)
			this.creationReturnMsg = "server_error"
		}

		return this.creationReturnMsg
	}

}
