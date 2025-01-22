import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store/user/user.state";
import {User} from "@ingenium/app/core/store";

/**
 * Guard that checks if the user is authenticated
 */
export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSnapshot(UserState.isAuthenticated)) {
    return true;
  }

  store.dispatch(new User.Login(
    router.getCurrentNavigation()?.extractedUrl.toString() || '/'
  ));
  return false;
};

/**
 * Guard that checks if the user is a guest
 */
export const guestGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (!store.selectSnapshot(UserState.isAuthenticated)) {
    return true;
  }

  return router.parseUrl('/');
}
