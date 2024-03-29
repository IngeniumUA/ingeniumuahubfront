import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {tap} from "rxjs";
import {AuthService} from "../services/user/auth/auth.service";
import {RolesService} from "../services/user/roles.service";
import {map} from "rxjs/operators";


export const webmasterGuard = () => {
  const router = inject(Router);

  const rolesService = inject(RolesService)
  return rolesService.isWebmaster.pipe(
    tap((value) => {
        return !value ? router.navigate(['/home']) : true
      }
    ))
};
