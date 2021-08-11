import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
	providedIn: 'root',
})
export class AdminGuardService implements CanActivate {
	constructor(private router: Router, private loginService: LoginService) {}

	async canActivate() {
		const roleCheckPromise = new Promise<boolean>(
			async (resolve, reject) => {
				try {
					const userData = await this.loginService.getUserData();
					if (userData.role == 'admin') {
						resolve(true);
					} else {
						resolve(false);
					}
				} catch (error) {
					resolve(false);
				}
			}
		);
		const result = await roleCheckPromise;
		if (!result) {
			this.router.navigate(['/']);
		}
		return result;
	}
}
