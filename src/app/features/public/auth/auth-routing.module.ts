import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from "./login/login.component";
import {RegisterPageComponent} from "./register/register/register-page.component";
import {AuthResetpwComponent} from "./resetpw/auth-resetpw.component";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'reset', component: AuthResetpwComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
