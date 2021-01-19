import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { OffersComponent } from './offers/offers.component';
import { FrontComponent } from './front.component';
import { SearchresultsComponent } from './searchresults/searchresults.component';

@NgModule({
  declarations: [FrontComponent, SearchboxComponent, OffersComponent, SearchresultsComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: []
})
export class FrontModule { }
