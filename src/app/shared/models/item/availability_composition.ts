import {AccessPolicyEnum} from "@ingenium/app/shared/models/access_policies/access_policies";

export interface AvailabilityCompositionI {
  disabled: boolean
  available: boolean
  dynamic_policy_type: AccessPolicyEnum | null
  dynamic_policy_content: string | null
}

export interface AvailabilityCompositionInI {
  disabled: boolean | null
  available: boolean | null
  dynamic_policy_type: AccessPolicyEnum | null
  dynamic_policy_content: string | null
}
