import {inject} from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from "../../services/user/auth/auth.service";

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userValue) {
    return true;
  }

  const nextUrl = router.getCurrentNavigation()?.extractedUrl; // Get route where we're trying to go
  return router.parseUrl('/auth/login?next=' + nextUrl); // Redirect to the login page with ?next=
};
