import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AdvanceSalaryComponent } from './advance-salary.component';
import { AdvancedSalarySidebarComponent } from './advance-salary-sidebar/advance-salary-sidebar.component';
import { AdvanceSalaryContentComponent } from './advance-salary-content/advance-salary-content.component';
import { AddAdvanceSalaryDialogComponent } from './dialogs/add-advance-salary-dialog/add-advance-salary-dialog.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AdvanceSalaryService } from './advance-salary.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
    { 
      path: '', 
      component: AdvanceSalaryComponent, 
      ...canActivate(redirectUnauthorizedToLogin),
      resolve: { resolve: AdvanceSalaryService },
      children: [
        {
          path: '',
          component: AdvanceSalaryContentComponent
        }
      ]
   }
];

@NgModule({
  declarations: [
    AdvanceSalaryComponent,
    AdvancedSalarySidebarComponent,
    AdvanceSalaryContentComponent,
    AddAdvanceSalaryDialogComponent,
  ],
 
  imports: [
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    NgxMatSelectSearchModule,
    CustomConfirmDialogModule,
    FormsModule,
    MatDialogModule,
    MatNativeDateModule,
    RouterModule.forChild(routes),
  ]
})
export class AdvanceSalaryModule {
}
