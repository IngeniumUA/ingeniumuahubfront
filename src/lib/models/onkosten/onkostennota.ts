export enum OnkostenNotaEnum {
	in_afwachting = 0,
	afgewerkt = 1,
	afgewezen = 2
}
export const OnkostenNotaEnumList = [OnkostenNotaEnum.in_afwachting, OnkostenNotaEnum.afgewezen, OnkostenNotaEnum.afgewerkt,];

export interface KostenInI {
	description: string;
	price_eu: number;
}
export interface KostenI extends KostenInI {
	onkostennota_volgnummer: number;
	id: number
	boekhoudpost: number;
}

export interface BillingInformation {
	given_name: string;
	family_name: string;
	iban: string;
}

export interface OnkostenNotaI {
	volgnummer: number;

	user: string;
	user_email: string;
	datum_gemaakte_kosten: string;
	billing_information: BillingInformation;
	price_eu: number;

	onkostennota_status: OnkostenNotaEnum;
	datum_onkosten_voldaan: string | null;

	last_edited_timestamp: string;
	completed_timestamp: string | null;

	kosten: KostenI[];
}

export interface OnkostenNotaWideI extends OnkostenNotaI {
	media_url_list: [];
}

export interface OnkostenNotaWideInI {
	user?: string;
	user_email: string;
	datum_gemaakte_kosten: string;
	billing_information: BillingInformation;

	kosten: KostenInI[];
}