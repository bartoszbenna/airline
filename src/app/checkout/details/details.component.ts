import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BasketService, IServerBasket } from 'src/app/basket/basket.service';
import { CheckoutService, IPassengerData } from '../checkout.service';

@Component({
	selector: 'app-details',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
	public basket: IServerBasket;
	public adult: number = 0;
	public child: number = 0;
	public infant: number = 0;
	public formGroups: FormGroup[] = [];
	public departureDate: Date;
	public minAdultDob: Date = new Date(1900, 1, 1);
	public maxAdultDob: Date; //adult min 14yrs
	public maxChildDob: Date; //child 2-14yrs
	public today: Date = new Date();
	public showError: boolean = false;

	constructor(
		private basketService: BasketService,
		private checkoutService: CheckoutService
	) {}

	ngOnInit(): void {
		this.basket = this.basketService.basket;
		this.adult = this.basket.flights[0].adult;
		this.child = this.basket.flights[0].child;
		this.infant = this.basket.flights[0].infant;
		this.initFormGroups();
		this.departureDate = this.basket.flights[0].depDate;
		this.maxAdultDob = new Date(this.departureDate);
		this.maxAdultDob.setFullYear(this.maxAdultDob.getFullYear() - 14);
		this.maxChildDob = new Date(this.departureDate);
		this.maxChildDob.setFullYear(this.maxChildDob.getFullYear() - 2);
	}

	initFormGroups(): void {
		for (let i = 1; i <= this.adult; i++) {
			this.formGroups.push(
				new FormGroup({
					type: new FormControl('adult'),
					firstName: new FormControl(null, [
						Validators.required,
						Validators.pattern('[a-zA-Z ]*'),
					]),
					lastName: new FormControl(null, [
						Validators.required,
						Validators.pattern('[a-zA-Z ]*'),
					]),
					dob: new FormControl(null, Validators.required),
				})
			);
		}
		for (let i = 1; i <= this.child; i++) {
			this.formGroups.push(
				new FormGroup({
					type: new FormControl('child'),
					firstName: new FormControl(null, [
						Validators.required,
						Validators.pattern('[a-zA-Z ]*'),
					]),
					lastName: new FormControl(null, [
						Validators.required,
						Validators.pattern('[a-zA-Z ]*'),
					]),
					dob: new FormControl(null, Validators.required),
				})
			);
		}
		for (let i = 1; i <= this.infant; i++) {
			this.formGroups.push(
				new FormGroup({
					type: new FormControl('infant'),
					firstName: new FormControl(null, [
						Validators.required,
						Validators.pattern('[a-zA-Z ]*'),
					]),
					lastName: new FormControl(null, [
						Validators.required,
						Validators.pattern('[a-zA-Z ]*'),
					]),
					dob: new FormControl(null, Validators.required),
				})
			);
		}
	}

	continue() {
		this.showError = false;
		for (let formGroup of this.formGroups) {
			if (!formGroup.valid) {
				this.showError = true;
			}
		}
		if (!this.showError) {
			let passengerData: IPassengerData[] = [];
			for (let formGroup of this.formGroups) {
				passengerData.push({
					type: formGroup.value.type,
					firstName: formGroup.value.firstName,
					lastName: formGroup.value.lastName,
					dob: formGroup.value.dob,
					handBaggage: 0,
					checkedBaggage: 0,
					seats: [],
				});
			}
			this.checkoutService.initPassengerData(passengerData);
			this.checkoutService.changeComponent('extras');
		}
	}
}
