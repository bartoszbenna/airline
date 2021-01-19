import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [BasketComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class BasketModule { }
