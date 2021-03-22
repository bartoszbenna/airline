import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BasketService, IServerBasket } from '../basket/basket.service';
import { CheckoutService } from './checkout.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
    @ViewChild('stepper') private stepper: MatHorizontalStepper;
	
	public basket: IServerBasket;
	public validity: Date;
	public countdown: string;
	public showDetails: boolean = true;
	public showExtras: boolean = false;
	public showPayment: boolean = false;
	public extrasCompleted: boolean = false;
	public interval: NodeJS.Timeout;

    constructor(private basketService: BasketService, private checkoutService: CheckoutService, private router: Router) {}

    ngOnInit(): void {
        this.basket = this.basketService.basket;
        if (!this.validateBasket(this.basket)) {
            this.router.navigate(['/']);
		}
		this.validity = moment(this.basket.expiryTime).toDate();
		this.setCountdown();
		this.interval = setInterval(() => {
			this.setCountdown();
			if (this.countdown == '00:00') {
				clearInterval(this.interval);
				this.router.navigate(['/']);
			}
		}, 1000)
		
		this.checkoutService.componentSubject.asObservable().subscribe(message => {
			this.stepper.selected.completed = true;
			if (message == 'extras') {
				this.showExtras = true;
			}
			else if (message == 'payment') {
				this.showPayment = true;
			}
			this.stepper.next();
		})
    }

	ngOnDestroy(): void {
		clearInterval(this.interval);
	}

    validateBasket(basket: IServerBasket) {
        try {
            if (
                basket.flights.length == 1 ||
                (basket.flights.length == 2 &&
                    basket.flights[0].adult == basket.flights[1].adult &&
                    basket.flights[0].child == basket.flights[1].child &&
                    basket.flights[0].infant == basket.flights[1].infant)
            	) {
					if (moment(basket.expiryTime).toDate() > new Date()) {
						return true;
					}
				}
            return false;
        } catch (error) {
            return false;
        }
	}
	
	setCountdown() {
		if (this.validity != undefined) {
			const now = moment(new Date());
			const minutes = moment(this.validity).diff(now, 'minutes');
			const seconds = moment(this.validity).diff(now, 'seconds') - minutes * 60;
			if (minutes >= 0 && seconds >= 0) {
				this.countdown = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
			}
		}
	}
}
