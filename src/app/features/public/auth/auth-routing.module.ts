import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from "./login/login.component";
import {RegisterPageComponent} from "./register/register/register-page.component";
import {ResetpwComponent} from "./resetpw/resetpw.component";
import {SetpwComponent} from "./setpw/setpw.component";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'reset', component: ResetpwComponent},
  {path: 'set/:uuid/:pw_settoken', component: SetpwComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
