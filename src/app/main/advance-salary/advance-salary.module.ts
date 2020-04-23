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

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AdvanceSalaryComponent } from './advance-salary.component';
import { AdvancedSalarySidebarComponent } from './advance-salary-sidebar/advance-salary-sidebar.component';
import { AdvanceSalaryContentComponent } from './advance-salary-content/advance-salary-content.component';
import { AddAdvanceSalaryDialogComponent } from './dialogs/add-advance-salary-dialog/add-advance-salary-dialog.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { AdvanceSalaryService } from './advance-salary.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'advanceSalary', component: AdvanceSalaryComponent, ...canActivate(redirectUnauthorizedToLoginPage), resolve: { resolve: AdvanceSalaryService } }
];

@NgModule({
  declarations: [
    AdvanceSalaryComponent,
    AdvancedSalarySidebarComponent,
    AdvanceSalaryContentComponent,
    AddAdvanceSalaryDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),

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

    FuseSidebarModule,
    FuseSharedModule,

    NgxDatatableModule,
    NgxMatSelectSearchModule,
    CustomConfirmDialogModule
  ],
  entryComponents: [
    AddAdvanceSalaryDialogComponent
  ]
})
export class AdvanceSalaryModule {
}
