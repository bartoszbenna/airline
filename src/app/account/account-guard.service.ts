import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable()
export class AccountGuardService implements CanActivate {
	constructor(private loginService: LoginService, private router: Router) {}

	async canActivate() {
		const routeActivationPromise = new Promise<boolean>(
			(resolve, reject) => {
				if (this.loginService.currentStatus == null) {
					const loginStatusSubscription = this.loginService
						.getLoginStatusObservable()
						.subscribe((message) => {
							if (message != null) {
								resolve(message);
								loginStatusSubscription.unsubscribe();
							}
						});
				} else if (
					typeof this.loginService.currentStatus == 'boolean'
				) {
					resolve(this.loginService.currentStatus);
				} else {
					resolve(false);
				}
			}
		);
		const result = await routeActivationPromise;
		if (result == false) {
			this.router.navigate(['/']);
		}
		return result;
	}
}
