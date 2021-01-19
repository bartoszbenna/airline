import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountRoutingModule } from './account-routing.module';
import { ReservationsComponent } from './reservations/reservations.component';
import { AccountGuardService } from './account-guard.service';
import { AccountComponent } from './account.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [AccountComponent, AccountDetailsComponent, ReservationsComponent ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule
  ],
  providers: [AccountGuardService]
})
export class AccountModule { }
