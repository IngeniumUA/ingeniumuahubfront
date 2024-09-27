import {inject} from '@angular/core';
import {RedirectCommand, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";


export const managerGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSnapshot(UserState.roles)?.is_manager) {
    return true;
  }

  return new RedirectCommand(router.parseUrl('/'));
};
