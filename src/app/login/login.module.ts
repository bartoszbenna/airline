import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterSuccessDialogComponent } from './register/register-success-dialog/register-success-dialog.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, RegisterSuccessDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class LoginModule { }
