import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-success-dialog',
  templateUrl: './register-success-dialog.component.html',
  styleUrls: ['./register-success-dialog.component.css']
})
export class RegisterSuccessDialogComponent implements OnInit, OnDestroy {

  private timeout: NodeJS.Timeout;

  constructor(private dialogRef: MatDialogRef<RegisterSuccessDialogComponent>) { }

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      this.dialogRef.close();
    }, 2500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

}
