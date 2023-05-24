import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from "./login/login.component";
import {RegisterComponent} from "./register/register/register.component";
import {AuthResetpwComponent} from "./resetpw/auth-resetpw.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthResetpwComponent,
  ]
})
export class AuthModule { }
