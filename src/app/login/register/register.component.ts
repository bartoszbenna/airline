import { Component, OnInit } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
} from '@angular/material/dialog';
import { LoginService } from '../login.service';
import { RegisterSuccessDialogComponent } from './register-success-dialog/register-success-dialog.component';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
	public showSpinner: boolean = false;
	public userExistsError: boolean = false;
	public registrationError: boolean = false;

	public registerForm = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(null, [
			Validators.required,
			Validators.minLength(6),
		]),
		confirmPassword: new FormControl(null),
		firstName: new FormControl(null, [
			Validators.required,
			Validators.pattern('[a-zA-Z ]*'),
		]),
		lastName: new FormControl(null, [
			Validators.required,
			Validators.pattern('[a-zA-Z ]*'),
		]),
	});

	constructor(
		private dialogRef: MatDialogRef<RegisterComponent>,
		private loginService: LoginService,
		private dialog: MatDialog
	) {}

	closeDialog() {
		this.dialogRef.close();
	}

	async submitForm() {
		this.userExistsError = false;
		this.registrationError = false;
		this.showSpinner = true;
		if (this.registerForm.valid) {
			const email = this.registerForm.get('email').value;
			const password = this.registerForm.get('password').value;
			const firstName = this.registerForm.get('firstName').value;
			const lastName = this.registerForm.get('lastName').value;
			try {
				await this.loginService.registerUser(
					email,
					password,
					firstName,
					lastName
				);
				this.dialogRef.close();
				this.openSuccessDialog();
			} catch (error) {
				this.showSpinner = false;
				if (error.status != undefined && error.status == 409) {
					this.userExistsError = true;
				} else {
					this.registrationError = true;
				}
			}
		}
	}

	onPasswordChange() {
		if (!this.checkPasswordMatching()) {
			this.registerForm
				.get('confirmPassword')
				.setErrors([{ passwordMismatch: true }]);
		} else {
			this.registerForm.get('confirmPassword').setErrors(null);
		}
	}

	checkPasswordMatching() {
		return (
			this.registerForm.get('password').value ==
			this.registerForm.get('confirmPassword').value
		);
	}

	openSuccessDialog() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.autoFocus = true;
		dialogConfig.maxWidth = '300px';

		this.dialog.open(RegisterSuccessDialogComponent, dialogConfig);
	}
}
