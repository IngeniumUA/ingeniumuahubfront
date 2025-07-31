export enum HubFlagTypeEnum {
	configuration=1,
	feature=2
}

export enum HubFlagValueTypeEnum {
	bool = 1,
	int = 2,
	string = 3,
	dict = 4,
}

export interface HubFlag {
	id: number;
	name: string;
	flag_type: HubFlagTypeEnum;
	value: { [key: string]: boolean | number | string };
	flag_value_type: number;
}

export function getFlagValue(flag: HubFlag) {
	switch (flag.flag_value_type) {
		case HubFlagValueTypeEnum.dict:
			return flag.value;
		default:
			return flag.value['value'];
	}
}