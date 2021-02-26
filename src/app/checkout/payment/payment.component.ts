import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService, IServerReservation } from '../checkout.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public reservation: IServerReservation;
  public isPaymentSuccessful: boolean = false;
  public showPaymentError: boolean = false;
  public showPaymentSpinner: boolean = false;
  public moment: any = moment;

  constructor(private checkoutService: CheckoutService,
    private basketService: BasketService,
    private router: Router) { }

  ngOnInit(): void {
    this.reservation = this.checkoutService.reservation;
  }

  getErrorMessage(error: string) {
    if (error == 'seats') {
      return 'One or more of the selected seats are no longer available. You can choose new seats later.';
    }
    else {
      return '';
    }
  }

  async confirmReservation() {
    this.showPaymentSpinner = true;
    this.showPaymentError = false;
    const result = await this.checkoutService.confirmReservation(this.reservation.reservation.reservationNumber);
    this.showPaymentSpinner = false;
    if (result) {
      this.basketService.emptyLocalBasket();
      this.isPaymentSuccessful = true;
    }
    else {
      this.showPaymentError = true;
      this.isPaymentSuccessful = false;
    }
  }

  redirect(target: string) {
    if (target == 'home') {
      this.router.navigate(['/']);
    }
    else if (target == 'reservations') {
      this.router.navigate(['/account/reservations']);
    }
  }
}
