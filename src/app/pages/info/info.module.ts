import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfoPageRoutingModule } from './info-routing.module';

import { InfoPage } from './info.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    InfoPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [InfoPage]
})
export class InfoPageModule {}
