import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlueprintsPageRoutingModule } from './blueprints-routing.module';

import { BlueprintsPage } from './blueprints.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlueprintsPageRoutingModule
  ],
  declarations: [BlueprintsPage]
})
export class BlueprintsPageModule {}
