export enum HubFlagTypeEnum {
	configuration=1,
	feature=2
}
export const HubFlagTypeList = [
	HubFlagTypeEnum.configuration,
	HubFlagTypeEnum.feature,
]

export enum HubFlagValueTypeEnum {
	bool = 1,
	int = 2,
	string = 3,
	dict = 4,
}
export const HubFlagValueTypeList = [
	HubFlagValueTypeEnum.bool,
	HubFlagValueTypeEnum.int,
	HubFlagValueTypeEnum.string,
	HubFlagValueTypeEnum.dict,
]

export type HubFlag =
	| {
			id: number;
			name: string;
			flag_type: HubFlagTypeEnum;
			flag_value_type: HubFlagValueTypeEnum.bool;
			value: boolean;
	  }
	| {
			id: number;
			name: string;
			flag_type: HubFlagTypeEnum;
			flag_value_type: HubFlagValueTypeEnum.int;
			value: number;
	  }
	| {
			id: number;
			name: string;
			flag_type: HubFlagTypeEnum;
			flag_value_type: HubFlagValueTypeEnum.string;
			value: string;
	  }
	| {
			id: number;
			name: string;
			flag_type: HubFlagTypeEnum;
			flag_value_type: HubFlagValueTypeEnum.dict;
			value: object;
	  };