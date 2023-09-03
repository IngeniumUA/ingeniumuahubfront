import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from "./login/login.component";
import {RegisterPageComponent} from "./register/register/register-page.component";
import {ResetpwComponent} from "./resetpw/resetpw.component";
import {RegisterComponent} from "../../../shared/components/auth/register/register.component";
import {GoogleSigninButtonModule} from "@abacritt/angularx-social-login";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        RegisterComponent,
        GoogleSigninButtonModule,
    ],
  declarations: [
    LoginComponent,
    RegisterPageComponent,
    ResetpwComponent,
  ]
})
export class AuthModule { }
