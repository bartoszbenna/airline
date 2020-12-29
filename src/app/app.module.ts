import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';

import { LoginModule } from './login/login.module';
import { NavbarModule } from './navbar/navbar.module';
import { FrontModule } from './front/front.module';

import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FrontComponent } from './front/front.component';
import { SearchboxComponent } from './front/searchbox/searchbox.component';
import { OffersComponent } from './front/offers/offers.component';
import { SearchresultsComponent } from './front/searchresults/searchresults.component';
import { BasketComponent } from './basket/basket.component';


@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    MatBadgeModule,
    MatTableModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    MatBadgeModule,
    MatTableModule
  ],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, strict: true}},
    {provide: MAT_DATE_FORMATS, useValue: {
      parse: { dateInput: 'DD/MM/YYYY' },
      display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMM YYYY' }
    }}
  ]
})
export class MatFormsModule { }

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    FrontComponent,
    SearchboxComponent,
    OffersComponent,
    SearchresultsComponent,
    BasketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormsModule,
    NavbarModule,
    FrontModule,
    LoginModule,

  ],
  exports: [
    MatFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }


