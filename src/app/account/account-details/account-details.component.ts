import { Component, OnInit } from '@angular/core';
import { IUserData, LoginService } from 'src/app/login/login.service';

@Component({
	selector: 'app-account-details',
	templateUrl: './account-details.component.html',
	styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit {
	constructor(private loginService: LoginService) {}

	public userData: IUserData;

	ngOnInit(): void {
		this.loginService
			.getUserDataObservable()
			.subscribe((userData: IUserData) => {
				this.userData = userData;
			});
	}
}
