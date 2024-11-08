import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TotalsPage } from './totals.page';

import { TotalsPageRoutingModule } from './totals-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TotalsPageRoutingModule
  ],
  declarations: [TotalsPage]
})
export class TotalsPageModule {}
