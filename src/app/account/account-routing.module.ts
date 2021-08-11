import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountGuardService } from './account-guard.service';
import { AccountComponent } from './account.component';
import { ReservationsComponent } from './reservations/reservations.component';

const routes: Routes = [
	{
		path: 'account',
		component: AccountComponent,
		children: [
			{ path: 'details', component: AccountDetailsComponent },
			{ path: 'reservations', component: ReservationsComponent },
		],
		canActivate: [AccountGuardService],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AccountRoutingModule {}
