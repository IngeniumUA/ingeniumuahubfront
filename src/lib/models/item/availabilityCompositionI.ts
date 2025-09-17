import type { AccessPolicyEnum } from '$lib/models/access_policy/AccessPolicyI';


export interface AccessPolicyI {
  access_policy_config: object
}

export interface AvailabilityCompositionI {
  available: boolean
  available_from: string | null
  available_until: string | null
  dynamic_policy_type: AccessPolicyEnum | null
  dynamic_policy_content: AccessPolicyI | null
}

export interface AvailabilityCompositionInI {
  available: boolean | null
  dynamic_policy_type: AccessPolicyEnum | null
  dynamic_policy_content: AccessPolicyI | null
}
