import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PopupzHomeComponent} from "@ingenium/app/features/popupz/popupz-home/popupz-home.component";
import {PopupzAllergiesComponent} from "@ingenium/app/features/popupz/popupz-allergies/popupz-allergies.component";
import {PopupzTemplateComponent} from "@ingenium/app/features/popupz/popupz-template.component";
import {PopupzMenuComponent} from "@ingenium/app/features/popupz/popupz-menu/popupz-menu.component";

const routes: Routes = [
  {
    path: '',
    component: PopupzTemplateComponent,
    children: [
      {
        path: '',
        component: PopupzHomeComponent
      },
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopupzRoutingModule { }
