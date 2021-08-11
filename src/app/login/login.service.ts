import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

export interface IUserData {
	email: string;
	firstName: string;
	lastName: string;
	role: string;
}

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	private loginStatusSubject = new BehaviorSubject<boolean>(null);
	private userDataSubject = new BehaviorSubject<any>({});
	public currentStatus: boolean = null;

	private loginApi = 'http://localhost:3000/login/';

	constructor(
		private cookieService: CookieService,
		private http: HttpClient,
		private router: Router
	) {}

	async login(email: string, password: string) {
		let loginPromise = new Promise((resolve, reject) => {
			this.http
				.post<any>(
					this.loginApi + 'authorize',
					{ email: email, password: password },
					{ withCredentials: true }
				)
				.subscribe(
					(res: any) => {
						this.sendStatusChange(true);
						resolve('success');
					},
					(error) => {
						reject(error);
					}
				);
		});
		let response = await loginPromise;
		return response;
	}

	async getUserData() {
		let userDataPromise = new Promise<IUserData>((resolve, reject) => {
			if (this.cookieService.check('token')) {
				const tokenString = this.cookieService.get('token');
				const headers = new HttpHeaders({
					'x-access-token': tokenString,
				});
				this.http
					.get(this.loginApi + 'verify', {
						headers: headers,
						withCredentials: true,
					})
					.subscribe(
						(res: IUserData) => {
							this.userDataSubject.next(res);
							this.sendStatusChange(true);
							resolve(res);
						},
						(error) => {
							this.sendStatusChange(false);
							this.userDataSubject.next({});
							reject();
							return;
						}
					);
			} else {
				this.sendStatusChange(false);
				reject();
				return;
			}
		});
		let userData = await userDataPromise;
		return userData;
	}

	async registerUser(
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) {
		let registrationPromise = new Promise<boolean>((resolve, reject) => {
			const body = {
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName,
			};
			this.http.post(this.loginApi + 'create', body).subscribe(
				(message) => {
					resolve(true);
				},
				(error) => {
					reject(error);
				}
			);
		});
		const result = await registrationPromise;
		return result;
	}

	logout() {
		this.sendStatusChange(false);
		if (this.cookieService.check('token')) {
			this.cookieService.delete('token');
		}
		this.router.navigate(['/']);
	}

	sendStatusChange(newStatus: boolean) {
		this.loginStatusSubject.next(newStatus);
		this.currentStatus = newStatus;
	}

	getLoginStatusObservable() {
		return this.loginStatusSubject.asObservable();
	}

	getUserDataObservable() {
		return this.userDataSubject.asObservable();
	}
}
