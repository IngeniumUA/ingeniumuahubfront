import {StaffAccessPolicyI} from "./staff/staff_access_policy";

export interface PricePolicyI {
    price: number
    access_policy: StaffAccessPolicyI
    update_fields: []
}
