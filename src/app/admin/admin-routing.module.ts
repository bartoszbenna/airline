import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuardService } from '../admin/admin-guard-service';
import { AdminComponent } from '../admin/admin.component';

const routes: Routes = [
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [AdminGuardService],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
