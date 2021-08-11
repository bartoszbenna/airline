import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
} from '@angular/material/dialog';
import { LoginService } from './login.service';
import { RegisterComponent } from './register/register.component';

interface IToken {
	result: string;
	loginToken: string;
	role: string;
}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	areCredentialsValid: boolean = true;
	hasErrorOccurred: boolean = false;
	isWaitingForResult: boolean = false;

	loginForm = new FormGroup({
		email: new FormControl('', [Validators.required]),
		password: new FormControl('', [Validators.required]),
	});

	constructor(
		private loginService: LoginService,
		public dialogRef: MatDialogRef<LoginComponent>,
		public dialog: MatDialog
	) {}

	openRegisterWindow() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;

		dialogConfig.autoFocus = true;
		dialogConfig.maxWidth = '300px';

		this.dialog.open(RegisterComponent, dialogConfig);
	}

	enableForm() {
		this.isWaitingForResult = false;
		this.loginForm.get('email').enable();
		this.loginForm.get('password').enable();
	}

	disableForm() {
		this.isWaitingForResult = true;
		this.loginForm.get('email').disable();
		this.loginForm.get('password').disable();
	}

	async submitForm() {
		const email = this.loginForm.value.email;
		const pass = this.loginForm.value.password;
		if (email != '' && pass != '') {
			this.disableForm();
			try {
				await this.loginService.login(email, pass);
				this.enableForm();
				this.areCredentialsValid = true;
				this.hasErrorOccurred = false;
				this.dialogRef.close();
			} catch (error) {
				if (error.status == 401) {
					this.enableForm();
					this.areCredentialsValid = false;
					this.hasErrorOccurred = false;
				} else {
					this.enableForm();
					this.areCredentialsValid = true;
					this.hasErrorOccurred = true;
				}
			}
		}
	}
}
