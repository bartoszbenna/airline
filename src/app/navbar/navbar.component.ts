import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  role: string;

  constructor(private loginService: LoginService, private router: Router) {
    this.loginService.getRole().then((res: string) => {
      if (res == 'admin' || res == 'client') {
        this.isLoggedIn = true;
        this.role = res;
      }
      else {
        this.isLoggedIn = false;
        this.role = '';
      }
    })
  }

  ngOnInit(): void {

  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

}
