import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {tap} from 'rxjs';
import {RolesService} from '../services/user/roles.service';


export const managerGuard = () => {
  const router = inject(Router);

  const rolesService = inject(RolesService);
  return rolesService.isManager.pipe(
    tap((value) => {
      return !value ? router.navigate(['/home']) : true;
    }
    ));
};
