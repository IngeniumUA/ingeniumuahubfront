import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebmasterComponent } from './webmaster.component';
import {WebmasterRoutingModule} from "./webmaster-routing.module";
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import {SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";
import { UsersListComponent } from './user/users-list/users-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { GroupListComponent } from './user/group-list/group-list.component';
import {
  GroupTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/group-table/group-table.component";
import {PublicHeaderComponent} from "../../core/layout/public/header/public-header.component";
import {
    UserTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/user-table/user-table.component";



@NgModule({
  declarations: [
    WebmasterComponent,
    UsersListComponent,
    UserDetailComponent,
    GroupListComponent,
  ],
    imports: [
        CommonModule,
        WebmasterRoutingModule,
        BehindheaderComponent,
        SidenavComponent,
        GroupTableComponent,
        PublicHeaderComponent,
        UserTableComponent,
    ]
})
export class WebmasterModule { }
