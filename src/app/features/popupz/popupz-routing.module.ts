import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PopupzAllergiesComponent} from "@ingenium/app/features/popupz/popupz-allergies/popupz-allergies.component";
import {PopupzTemplateComponent} from "@ingenium/app/features/popupz/popupz-template.component";
import {PopupzMenuComponent} from "@ingenium/app/features/popupz/popupz-menu/popupz-menu.component";
import {
  PopupzPublicTrackerComponent
} from "@ingenium/app/features/popupz/popupz-public-tracker/popupz-public-tracker.component";

const routes: Routes = [
  {
    path: '',
    component: PopupzTemplateComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopupzRoutingModule { }
