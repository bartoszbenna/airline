import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from './login.service';

interface IToken {
  result: string;
  loginToken: string;
  role: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoginValid: boolean = true;

  loginForm = new FormGroup({
    login: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private loginService: LoginService, public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
  }

  submitForm() {
  const login = this.loginForm.value.login;
  const pass = this.loginForm.value.password;
    this.loginService.login(login, pass).then((res: IToken) => {
      if (res.result == 'correct') {
        this.isLoginValid = true;
        this.dialogRef.close();
      }
      else {
        this.isLoginValid = false;
      }
    });
  }
}
