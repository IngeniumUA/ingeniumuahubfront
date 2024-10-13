import {Pipe, PipeTransform} from "@angular/core";

export enum AccessPolicyEnum {
  always_available = 0,  // Always available is stored as 'None' or 'Null' value in db
  member_of_group = 1
}

export interface AllowDenyListI {
    whitelist: number[] | null
    blacklist: number[] | null
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
