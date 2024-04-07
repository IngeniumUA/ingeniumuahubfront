import {AccessPolicyI} from './staff/staff_access_policy';

export interface PricePolicyI {
    price: number
    access_policy: AccessPolicyI
    always_available: boolean
    allow_invalid_access: boolean
    update_fields: { [key: string]: any } | null
}
