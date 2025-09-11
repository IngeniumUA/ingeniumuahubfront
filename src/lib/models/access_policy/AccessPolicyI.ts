export enum AccessPolicyEnum {
	// Native access query param
	always_available = 0, // 0 is null value, this should never be explicitly set
	member_of_group = 1,
	access_key_in_path = 100
}

export const AccessPolicyEnumList = [
	AccessPolicyEnum.always_available,
	AccessPolicyEnum.member_of_group,
	AccessPolicyEnum.access_key_in_path,
]