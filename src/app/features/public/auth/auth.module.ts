import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import {RegisterComponent} from '../../../shared/components/auth/register/register.component';
import {PublicHeaderComponent} from '../../../core/layout/public/header/public-header.component';
import {AuthCallbackComponent} from "@ingenium/app/features/public/auth/callback/auth-callback.component";
import {AuthLogoutComponent} from "@ingenium/app/features/public/auth/logout/auth-logout.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    RegisterComponent,
    PublicHeaderComponent,
  ],
  declarations: [
    AuthCallbackComponent,
    AuthLogoutComponent,
  ]
})
export class AuthModule { }
