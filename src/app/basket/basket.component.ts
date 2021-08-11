import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SearchService } from '../front/search.service';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../login/login.service';
import { BasketService } from './basket.service';

@Component({
	selector: 'app-basket',
	templateUrl: './basket.component.html',
	styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
	@ViewChild(MatTable) table: MatTable<any>;

	public basketContent = [];
	public columnsDisplayed = [
		'flightNumber',
		'dates',
		'depAirport',
		'arrAirport',
		'adult',
		'child',
		'infant',
		'price',
		'remove',
	];
	public totalBasketCount = 0;
	public moment: any = moment;
	public isWaitingForResponse: boolean = false;
	public showErrorMessage: boolean = false;
	public errorMessage: string = '';

	constructor(
		private basketService: BasketService,
		public searchService: SearchService,
		private loginService: LoginService,
		private dialog: MatDialog,
		private router: Router
	) {}

	ngOnInit(): void {
		this.basketService.basketContentSubject.subscribe((message) => {
			this.showErrorMessage = false;
			this.basketContent = message;
			this.recountPrices();
		});
	}

	removeFromBasket(element: any) {
		this.basketService.remove(element);
		this.table.renderRows();
		this.recountPrices();
	}

	recountPrices() {
		if (this.basketContent != null) {
			for (let element of this.basketContent) {
				element.totalPrice =
					(element.adult + element.child + element.infant) *
					element.price;
			}
		}
		let tempPrice = 0;
		if (this.basketContent != null) {
			for (let element of this.basketContent) {
				tempPrice += element.totalPrice;
			}
		}
		this.totalBasketCount = tempPrice;
	}

	async continue() {
		this.isWaitingForResponse = true;
		try {
			await this.loginService.getUserData();
		} catch (error) {}
		if (this.loginService.currentStatus == true) {
			try {
				await this.basketService.uploadBasket();
				this.router.navigate(['/checkout']);
			} catch (error) {
				if (error == 'unauthorized' || error.error.statusCode == 401) {
					this.openLoginDialog();
				} else if (
					error.error.statusCode == 404 &&
					error.error.message == 'FlightNotAvailable'
				) {
					this.errorMessage =
						'One or more of selected flights is no longer available.';
					this.showErrorMessage = true;
				} else {
					this.errorMessage = 'An error has occured';
					this.showErrorMessage = true;
				}
			}
		} else {
			this.openLoginDialog();
		}
		this.table.renderRows();
		this.isWaitingForResponse = false;
	}

	openLoginDialog() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.autoFocus = true;
		dialogConfig.maxWidth = '300px';

		this.dialog.open(LoginComponent, dialogConfig);
	}
}
