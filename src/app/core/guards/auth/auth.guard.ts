import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store/user/user.state";

export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSnapshot(UserState.isAuthenticated)) {
    return true;
  }

  const nextUrl = router.getCurrentNavigation()?.extractedUrl; // Get route where we're trying to go
  return router.parseUrl('/auth/login?next=' + nextUrl); // Redirect to the login page with ?next=
};
