import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from "./login/login.component";
import {RegisterPageComponent} from "./register/register/register-page.component";
import {AuthResetpwComponent} from "./resetpw/auth-resetpw.component";
import {RegisterComponent} from "../../../shared/components/auth/register/register.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        RegisterComponent,
    ],
  declarations: [
    LoginComponent,
    RegisterPageComponent,
    AuthResetpwComponent,
  ]
})
export class AuthModule { }
