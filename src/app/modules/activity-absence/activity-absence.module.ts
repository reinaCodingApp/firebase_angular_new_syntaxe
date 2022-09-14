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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ActivityAbsenceComponent } from './activity-absence.component';
import { ActivityAbsenceSidebarComponent } from './activity-absence-sidebar/activity-absence-sidebar.component';
import { ActivityAbsenceContentComponent } from './activity-absence-content/activity-absence-content.component';
import { AddActivityAbsenceDialogComponent } from './dialogs/add-activity-absence-dialog/add-activity-absence-dialog.component';
import { ActivityAbsenceService } from './activity-absence.service';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { SharedModule } from 'app/shared/shared.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  { 
    path: '', 
    component: ActivityAbsenceComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: ActivityAbsenceService } }];

@NgModule({
  declarations: [
    ActivityAbsenceComponent,
    ActivityAbsenceSidebarComponent,
    ActivityAbsenceContentComponent,
    AddActivityAbsenceDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatMomentDateModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatTableModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    CustomConfirmDialogModule,
    MatSidenavModule,
    MatSortModule,
    MatPaginatorModule,

  ],
  entryComponents: [
    AddActivityAbsenceDialogComponent
  ]
})
export class ActivityAbsenceModule {
}
