import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSuccessDialogComponent } from './register-success-dialog.component';

describe('RegisterSuccessDialogComponent', () => {
  let component: RegisterSuccessDialogComponent;
  let fixture: ComponentFixture<RegisterSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSuccessDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
