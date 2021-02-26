import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasketComponent } from './basket/basket.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutGuardService } from './checkout/checkout.guard.service';
import { FrontComponent } from './front/front.component';

const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent, canActivate: [CheckoutGuardService]},
  { path: 'basket', component: BasketComponent},
  { path: '', component: FrontComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
