import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';

import { LoginModule } from './login/login.module';
import { NavbarModule } from './navbar/navbar.module';
import { FrontModule } from './front/front.module';
import { AccountModule } from './account/account.module';
import { BasketModule } from './basket/basket.module';
import { CheckoutModule } from './checkout/checkout.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NavbarModule,
    FrontModule,
    LoginModule,
    AccountModule,
    BasketModule,
    CheckoutModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }


