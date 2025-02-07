import {inject} from '@angular/core';
import {RedirectCommand, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";
import {catchError, of, skipWhile, timeout} from "rxjs";
import {map} from "rxjs/operators";

export const managerGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserState.roles)
    .pipe(
      skipWhile(roles => !roles), // Wait when roles is null
      timeout(3000), // Wait 3 seconds
      map((roles: string[]|null): boolean|RedirectCommand => {
        if (roles?.includes('manager')) {
          return true;
        }

        return new RedirectCommand(router.parseUrl('/'));
      }), catchError((_) => {
        return of(new RedirectCommand(router.parseUrl('/')));
      })
    );
};
