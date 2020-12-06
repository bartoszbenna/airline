import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  submitForm() {
    const login = this.loginForm.value.login;
    const pass = this.loginForm.value.password;
    if (login == '' || pass == '') {
      
    }
    else {
      this.loginService.login(login, pass).then((res: tokenData) => {
        if (res.result == 'correct') {
          this.router.navigate(['/']);
        }
        else {
          console.log("incorrect!")
        }
      });
    }
  }
}

class tokenData {
  result: string;
  loginToken: string;
  role: string;
}
