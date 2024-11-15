import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HandscanPage } from './handscan.page';

import { HandscanPageRoutingModule } from './handscan-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HandscanPageRoutingModule
  ],
  declarations: [HandscanPage]
})
export class HandscanPageModule {}
