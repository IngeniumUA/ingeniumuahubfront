import {inject} from '@angular/core';
import {RedirectCommand, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";
import {catchError, Observable, of, skipWhile, timeout} from "rxjs";
import {map} from "rxjs/operators";


export const staffGuard = () : Observable<boolean|RedirectCommand> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserState.roles)
    .pipe(
      skipWhile(roles => !roles), // Wait when roles is null
      timeout(3000), // Timeout after 3 seconds
      map((roles: string[]|null): boolean|RedirectCommand => {
        if (roles?.includes('staff')) {
          return true;
        }

        return new RedirectCommand(router.parseUrl('/'));
      }), catchError((_) => {
        return of(new RedirectCommand(router.parseUrl('/')));
      })
    );
};
