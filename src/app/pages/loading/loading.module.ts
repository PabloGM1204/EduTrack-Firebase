import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingPageRoutingModule } from './loading-routing.module';

import { LoadingPage } from './loading.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LoadingPageRoutingModule
  ],
  declarations: [LoadingPage]
})
export class LoadingPageModule {}
