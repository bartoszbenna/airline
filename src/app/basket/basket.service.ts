import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

export interface IFlight {
	_id: string;
	flightNumber: string;
	depDate: Date;
	arrDate: Date;
	depCode: string;
	arrCode: string;
	planeType: string;
	occupiedSeats: string;
	price: number;
	adult: number;
	child: number;
	infant: number;
}

export interface IServerBasket {
	_id: string;
	flights: IFlight[];
	expiryTime: Date;
	totalPrice: number;
}

@Injectable({
	providedIn: 'root',
})
export class BasketService {
	public basket: IServerBasket;
	public basketContent = [];
	public basketContentSubject = new BehaviorSubject<any[]>(null);
	private basketApiUrl = 'http://localhost:3000/basket/';

	constructor(
		private http: HttpClient,
		private cookieService: CookieService
	) {}

	public addToBasket(content: any[]) {
		this.basketContent = [];
		for (let element of content) {
			this.basketContent.push(element);
		}
		this.basketContentSubject.next(this.basketContent);
	}

	public remove(element: any) {
		for (let i = 0; i < this.basketContent.length; i++) {
			if (this.basketContent[i] == element) {
				this.basketContent.splice(i, 1);
				return;
			}
		}
	}

	public async uploadBasket() {
		const basketUploadPromise = new Promise<IServerBasket>(
			(resolve, reject) => {
				if (this.cookieService.check('token')) {
					const token = this.cookieService.get('token');
					const headers = new HttpHeaders({
						'x-access-token': token,
					});
					this.http
						.post(
							this.basketApiUrl + 'upload',
							this.basketContent,
							{ headers: headers }
						)
						.subscribe(
							(message: IServerBasket) => {
								this.basket = message;
								this.basketContent = [];
								this.addToBasket(message.flights);
								resolve(message);
							},
							(error) => {
								reject(error);
							}
						);
				} else {
					reject('unauthorized');
				}
			}
		);
		const result = await basketUploadPromise;
		return result;
	}

	public emptyLocalBasket() {
		this.addToBasket([]);
	}
}
