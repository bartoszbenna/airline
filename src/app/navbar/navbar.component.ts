import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../login//login.component';
import { BasketService } from '../basket/basket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public role: string;

  constructor(private loginService: LoginService, 
              private dialog: MatDialog,
              public basketService: BasketService,
              private router: Router) {}

  ngOnInit(): void {
    this.initNavbar();
    this.loginService.getLoginStatusObservable().subscribe(message => {
      this.isLoggedIn = message;
      if (this.isLoggedIn) {
        this.initNavbar();
      }
    })
  }

  private initNavbar() {
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

  openDialog() {
    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '300px';

    this.dialog.open(LoginComponent, dialogConfig);
  }

  logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
  }

  openBasket() {
    this.router.navigate(['basket'])
  }

}
