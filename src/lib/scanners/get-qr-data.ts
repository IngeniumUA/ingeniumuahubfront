import { PUBLIC_API_URL } from '$env/static/public';
import {CapacitorHttp} from "@capacitor/core";
import type { TransactionI } from '$lib/models/transactionI.ts';
import { getTokens } from '$lib/auth/auth.ts';
import { blueprintsDict } from './blueprints';
import { selectedEvent } from '$lib/scanners/get-events.ts';
import { ValidityEnum } from '$lib/models/productsI.ts';
import { PaymentStatusEnum } from '$lib/models/enums.ts';
import { PriceDict } from '$lib/scanners/prices.ts';


export class GetQrDataService {
	private returnMsgTrans: string | TransactionI = "startMsg"
	private returnMsgUser: string | UserI = "startMsg"

	async getQrTransaction(interactionUUID: string = "", interactionID: number = -1, eventID: string = "") {
		let suffix: string
		interactionUUID = interactionUUID.replace("https://ingeniumua.be/card/", "")
		if (interactionUUID.length < 37) {
			if (interactionUUID !== "") {suffix = "?card_uuid=" + interactionUUID} else {suffix = "?interaction_id=" + interactionID}
		} else {
			if (interactionUUID !== "") {suffix = "?interaction_uuid=" + interactionUUID} else {suffix = "?interaction_id=" + interactionID}
		}
		if (eventID !== "") {suffix += "&?item=" + eventID}

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/transaction" + suffix,
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options)

			if (response.status === 200) {
				let responded: boolean = false
				const jsonResponse = await response.data as TransactionI[]
				for (const transaction of jsonResponse) {
					if (blueprintsDict[selectedEvent] !== undefined) {
						if (blueprintsDict[selectedEvent][transaction.product_blueprint_name]) {
							if (transaction.validity === 2 || transaction.validity === 3) {
								this.returnMsgTrans = transaction
								responded = true
							}
						}
					}
				}
				if (!responded) {
					if (jsonResponse.length > 0) {
						this.returnMsgTrans = jsonResponse[0] as TransactionI
					} else {
						this.returnMsgTrans = "uuid_error"
					}
				}

			} else if (response.status === 401 || response.status === 500) {
				this.returnMsgTrans = "server_error"
			} else if (response.status === 406) {
				this.returnMsgTrans = "uuid_error"
			}

		} catch (error) {
			console.log(error)
			this.returnMsgTrans = "server_error"
		}

		return this.returnMsgTrans
	}

	async getQrUser(user: string) {

		try {
			const accessToken = getTokens(null).access_token;
			const options = {
				url: PUBLIC_API_URL + "/user/" + user,
				headers: {Authorization: `Bearer ${accessToken}`}
			}
			const response = await CapacitorHttp.get(options)

			if (response.status === 200) {
				const jsonResponse = await response.data
				this.returnMsgUser = jsonResponse as UserI

			} else if (response.status === 401 || response.status === 500) {
				this.returnMsgUser = "server_error"
			} else if (response.status === 406) {
				this.returnMsgUser = "uuid_error"
			}

		} catch (error) {
			console.log(error)
			this.returnMsgUser = "server_error"
		}

		return this.returnMsgUser
	}

	async getQrData(eventID: string | undefined, interactionUUID: string = "", interactionID: number = -1): Promise<string | QrData> {
		const transaction = await this.getQrTransaction(interactionUUID, interactionID)
		if (typeof transaction !== "string") {
			const user = await this.getQrUser(transaction.interaction.user_uuid)
			if (typeof user !== "string"){
				const transaction_user: TransactionUserI = new TransactionUserI(transaction, user)
				return this.processData(eventID, transaction_user)
			} else {
				return user
			}
		} else {
			return transaction
		}

	}

	private processData(eventID: string | undefined, jsonResponse: TransactionUserI): string | QrData {
		let productString: string = ""
		let toPay: string = ""
		let validity: string = ""
		let id: string = ""
		let checkoutStatus: string = ""
		let email: string = ""
		let lidStatus: string = ""
		let notes: string = ""
		let blueprintName: string = ""
		let pricePolicyName: string = ""

		if (eventID === undefined) {return "no_event"}
		if (jsonResponse.transaction === "no_transaction") {return "uuid_error"}

		jsonResponse.transaction = jsonResponse.transaction as TransactionI
		if (jsonResponse.transaction.validity === 1) {return "uuid_error"}
		if (jsonResponse.transaction.transaction_status !== 1) {return "uuid_error"}

		const blueprintStringTemp: string | undefined = jsonResponse.transaction.product_blueprint_name
		if (typeof blueprintStringTemp === "undefined") {blueprintName = "undefined"} else {blueprintName = blueprintStringTemp}

		const productStringTemp: string | undefined = jsonResponse.transaction.interaction.item_name
		if (typeof productStringTemp === "undefined") {productString = "undefined"} else {productString = productStringTemp}
		productString = productString + ": " + jsonResponse.transaction.purchased_product.name

		const PolicyNameTemp: string | null | undefined = jsonResponse.transaction.purchased_product.price_policy?.name
		if (PolicyNameTemp === null || PolicyNameTemp === undefined) {pricePolicyName = "undefined"} else {pricePolicyName = PolicyNameTemp}

		if ("" + jsonResponse.transaction.interaction.item_id === eventID || eventID === "alle") {
			let owedValue: number
			if (jsonResponse.transaction.validity === 3) {
				const nietLidPrice = PriceDict[eventID]
				if (jsonResponse.transaction.purchased_product.price_policy?.price !== undefined) {
					owedValue = nietLidPrice - jsonResponse.transaction.purchased_product.price_policy?.price
				} else {
					owedValue = 0
				}
			} else {
				owedValue = 0
			}
			toPay = "€" + owedValue.toFixed(2)
			validity = ValidityEnum[jsonResponse.transaction.validity]

		} else {
			toPay = "NVT"
			validity = "Wrong event"
		}

		id = jsonResponse.transaction.interaction.interaction_id.toString()
		const emailTemp: string | undefined = jsonResponse.transaction.interaction.user_email
		if (typeof emailTemp === "undefined") {email = "undefined"} else {email = emailTemp}
		checkoutStatus = PaymentStatusEnum[jsonResponse.transaction.transaction_status]
		if (checkoutStatus !== "successful") {
			validity = "consumed"
		}
		if (jsonResponse.user.roles.is_lid) {lidStatus = "Lid"} else {lidStatus = "Niet-lid"}
		if (jsonResponse.transaction.note === null) {notes = ""} else {
			notes = jsonResponse.transaction.note
		}

		return {
			"productString": productString,
			"toPay": toPay,
			"validity": validity,
			"id": id,
			"checkoutStatus": checkoutStatus,
			"email": email,
			"lidStatus": lidStatus,
			"notes": notes,
			"blueprintName": blueprintName,
			"pricePolicyName": pricePolicyName
		} as QrData

	}

}

export function setQr(qr: string) {
	scannedQr = qr
}

export let scannedQr: string = ""

export interface QrData{
	productString: string
	toPay: string
	validity: string
	id: string
	checkoutStatus: string
	email: string
	lidStatus: string
	notes: string
	blueprintName: string
	pricePolicyName: string
}

export class TransactionUserI{
	constructor(
		public transaction: TransactionI | string,
		public user: UserI) {}
}

export interface UserI {
	// PRIVATE model for user information

	user_uuid: string
	sso_uuid: string | null

	email: string
	disabled: boolean

	created_timestamp: string
	last_update_timestamp: string
	last_login: string

	manager: boolean

	roles: UserRolesI
}

export interface UserRolesI {
	is_manager: boolean
	is_webmaster: boolean
	is_staff: boolean
	is_lid: boolean
}
