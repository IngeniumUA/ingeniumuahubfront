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

export interface HubFlag {
	id: number;
	name: string;
	flag_type: HubFlagTypeEnum;
	value: boolean | number | string;
	flag_value_type: number;
}