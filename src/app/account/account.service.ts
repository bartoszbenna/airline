import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IReservation } from '../checkout/checkout.service';
import { LoginService } from '../login/login.service';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private reservationApi: string = 'http://localhost:3000/reservation/';

	constructor(
		private http: HttpClient,
		private loginService: LoginService,
		private router: Router,
		private cookieService: CookieService
	) {}

	public async getReservations() {
		const reservationPromise = new Promise<IReservation[]>(
			async (resolve, reject) => {
				await this.verifyUserData();
				if (!this.loginService.currentStatus) {
					this.router.navigate(['/']);
					resolve([]);
				}
				const token = this.cookieService.get('token');
				const headers = new HttpHeaders({ 'x-access-token': token });
				this.http
					.get<IReservation[]>(this.reservationApi + 'get', {
						headers: headers,
					})
					.subscribe(
						(res) => {
							resolve(res);
						},
						(error) => {
							reject();
						}
					);
			}
		);
		const result = await reservationPromise;
		return result;
	}

	private async verifyUserData() {
		try {
			await this.loginService.getUserData();
			return true;
		} catch (error) {
			return false;
		}
	}
}
