import { Component, OnInit } from '@angular/core';
import { IUserData, LoginService } from '../login/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../login//login.component';
import { BasketService } from '../basket/basket.service';
import { Router } from '@angular/router';
import { SearchService } from '../front/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public firstName: string;
  public lastName: string;
  public role: string;

  constructor(private loginService: LoginService, 
              private dialog: MatDialog,
              public basketService: BasketService,
              private searchService: SearchService,
              public router: Router) {}

  ngOnInit(): void {
    this.loginService.getLoginStatusObservable().subscribe(message => {
      if (message == null) {
        this.initNavbar();
      }
      if (message != this.isLoggedIn) {
        this.isLoggedIn = message;
        if (this.isLoggedIn) {
          this.initNavbar();
        }
      }
    })
  }

  private async initNavbar() {
    try {
      const userData: any = await this.loginService.getUserData()
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
      this.role = userData.role;
      this.isLoggedIn = true;
    }
    catch (error) {
      this.isLoggedIn = false;
      this.firstName = undefined
      this.lastName = undefined
      this.role = undefined
    }
  }

  redirectToHome() {
    this.searchService.hideResults();
    this.router.navigate(['']);
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
    this.router.navigate(['basket']);
  }

}
