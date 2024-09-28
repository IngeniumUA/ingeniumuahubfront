import {inject} from '@angular/core';
import {RedirectCommand, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";
import {catchError, of, skipWhile} from "rxjs";
import {map} from "rxjs/operators";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";


export const webmasterGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserState.roles)
    .pipe(
      skipWhile(roles => !roles), // Wait when roles is null
      map((roles: UserRolesI|null): boolean|RedirectCommand => {
        if (roles?.is_webmaster) {
          return true;
        }

        return new RedirectCommand(router.parseUrl('/'));
      }), catchError((_) => {
        return of(new RedirectCommand(router.parseUrl('/')));
      })
    );
};
