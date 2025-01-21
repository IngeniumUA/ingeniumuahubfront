import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import {PublicHeaderComponent} from '../../../core/layout/public/header/public-header.component';
import {AuthCallbackComponent} from "@ingenium/app/features/public/auth/callback/auth-callback.component";
import {AuthLogoutComponent} from "@ingenium/app/features/public/auth/logout/auth-logout.component";
import {AuthLoginComponent} from "@ingenium/app/features/public/auth/login/auth-login.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        PublicHeaderComponent,
        AuthCallbackComponent,
        AuthLogoutComponent,
        AuthLoginComponent,
    ]
})
export class AuthModule { }
