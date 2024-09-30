import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PopupzAllergiesComponent} from "@ingenium/app/features/popupz/popupz-allergies/popupz-allergies.component";
import {PopupzTemplateComponent} from "@ingenium/app/features/popupz/popupz-template.component";
import {PopupzMenuComponent} from "@ingenium/app/features/popupz/popupz-menu/popupz-menu.component";
import {
  PopupzPublicTrackerComponent
} from "@ingenium/app/features/popupz/popupz-public-tracker/popupz-public-tracker.component";
import {
  PopupzStaffDisplayComponent
} from "@ingenium/app/features/popupz/popupz-staff-display/popupz-staff-display.component";
import {staffGuard} from "@ingenium/app/core/guards/staff.guard";

const routes: Routes = [
  {
    path: '',
    component: PopupzTemplateComponent,
    canActivate: [staffGuard],
    children: [
      {
        path: 'menu',
        component: PopupzMenuComponent
      },
      {
        path: 'menu/:category',
        component: PopupzMenuComponent
      },
      {
        path: 'allergies',
        component: PopupzAllergiesComponent
      },
      {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'public-tracker',
    component: PopupzPublicTrackerComponent
  },
  {
    path: 'staff',
    component: PopupzStaffDisplayComponent,
    canActivate: [staffGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopupzRoutingModule { }
