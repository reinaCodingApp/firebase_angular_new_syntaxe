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

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ActivityAbsenceComponent } from './activity-absence.component';
import { ActivityAbsenceSidebarComponent } from './activity-absence-sidebar/activity-absence-sidebar.component';
import { ActivityAbsenceContentComponent } from './activity-absence-content/activity-absence-content.component';
import { AddActivityAbsenceDialogComponent } from './dialogs/add-activity-absence-dialog/add-activity-absence-dialog.component';
import { ActivityAbsenceService } from './activity-absence.service';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'absences', component: ActivityAbsenceComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
  resolve: { resolve: ActivityAbsenceService } }
];

@NgModule({
  declarations: [
    ActivityAbsenceComponent,
    ActivityAbsenceSidebarComponent,
    ActivityAbsenceContentComponent,
    AddActivityAbsenceDialogComponent
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
    MatCheckboxModule,
    NgxMatSelectSearchModule,

    FuseSidebarModule,
    FuseSharedModule,

    NgxDatatableModule,
    CustomConfirmDialogModule
  ],
  entryComponents: [
    AddActivityAbsenceDialogComponent
  ]
})
export class ActivityAbsenceModule {
}
