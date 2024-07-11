import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {guestGuard} from "@ingenium/app/core/guards/auth/auth.guard";
import {AuthCallbackComponent} from "@ingenium/app/features/public/auth/callback/auth-callback.component";
import {AuthLogoutComponent} from "@ingenium/app/features/public/auth/logout/auth-logout.component";
import {AuthLoginComponent} from "@ingenium/app/features/public/auth/login/auth-login.component";


const routes: Routes = [
  {path: 'callback', title: 'Aanmelden', component: AuthCallbackComponent, canActivate: [guestGuard]},
  {path: 'login', title: 'Aanmelden', component: AuthLoginComponent, canActivate: [guestGuard]},
  {path: 'logout', title: 'Afmelden', component: AuthLogoutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
