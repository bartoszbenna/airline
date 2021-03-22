import { NgModule } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';

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
      MatTableModule,
      MatProgressSpinnerModule,
      MatMenuModule,
      MatIconModule,
      MatDialogModule,
      MatCardModule,
      MatTabsModule,
      MatStepperModule,
      MatExpansionModule
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
      MatTableModule,
      MatProgressSpinnerModule,
      MatMenuModule,
      MatIconModule,
      MatDialogModule,
      MatCardModule,
      MatTabsModule,
      MatStepperModule,
      MatExpansionModule
    ],
    providers: [
      {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, strict: true}},
      {provide: MAT_DATE_FORMATS, useValue: {
        parse: { dateInput: 'DD/MM/YYYY' },
        display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMM YYYY' }
      }}
    ]
  })
  export class MaterialModule { }