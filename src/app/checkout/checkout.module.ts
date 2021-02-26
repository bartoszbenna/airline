import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutGuardService } from './checkout.guard.service';
import { DetailsComponent } from './details/details.component';
import { ExtrasComponent } from './extras/extras.component';
import { PaymentComponent } from './payment/payment.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [CheckoutComponent, DetailsComponent, ExtrasComponent, PaymentComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [CheckoutGuardService]
})
export class CheckoutModule { }
