import {Pipe, PipeTransform} from "@angular/core";

export enum AccessPolicyEnum {
  always_available = 0,  // Always available is stored as 'None' or 'Null' value in db
  member_of_group = 1,

  access_key = 100
}

export const AccessPoliciesList: AccessPolicyEnum[] = [
  AccessPolicyEnum.always_available,
  AccessPolicyEnum.member_of_group,
  AccessPolicyEnum.access_key,
]

export interface AllowDenyListI {
  whitelist: number[] | null
  blacklist: number[] | null
}

export interface AccessKeyI {
  access_key: string
}


@Pipe({
  name: 'castToMemberOfGroup',
  standalone: true,
  pure: true
})
export class CastToMemberOfGroupPipe implements PipeTransform {
  transform(value: any): AllowDenyListI | null {
    return value;
  }
}

@Pipe({
  name: 'castToAccessKey',
  standalone: true,
  pure: true
})
export class CastAccessKeyPipe implements PipeTransform {
  transform(value: any): AccessKeyI | null {
    return value;
  }
}
