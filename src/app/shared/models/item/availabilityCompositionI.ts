import {AccessPolicyEnum} from "@ingenium/app/shared/models/access_policies/accessPolicyI";

export interface AccessPolicyI {
  access_policy_config: object
}

export interface AvailabilityCompositionI {
  disabled: boolean
  available: boolean
  dynamic_policy_type: AccessPolicyEnum | null
  dynamic_policy_content: AccessPolicyI | null
}

export interface AvailabilityCompositionInI {
  disabled: boolean | null
  available: boolean | null
  dynamic_policy_type: AccessPolicyEnum | null
  dynamic_policy_content: AccessPolicyI | null
}
