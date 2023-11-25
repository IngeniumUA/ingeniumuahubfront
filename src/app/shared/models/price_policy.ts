import {AccessPolicyI, StaffAccessPolicyI} from "./staff/staff_access_policy";

export interface PricePolicyI {
    price: number
    access_policy: AccessPolicyI
    update_fields: [] | null
}
