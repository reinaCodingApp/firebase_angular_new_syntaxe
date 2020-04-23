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
import { MatCheckboxModule, MatTableModule, MatMenuModule, MatSortModule } from '@angular/material';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ActivityComponent } from './activity.component';
import { ActivitySidebarComponent } from './activity-sidebar/activity-sidebar.component';
import { ActivityContentComponent } from './activity-content/activity-content.component';
import { AddActivityDialogComponent } from './dialogs/add-activity-dialog/add-activity-dialog.component';
import { ActivityEmployeesCountersComponent } from './activity-content/activity-employees-counters/activity-employees-counters.component';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ActivityService } from './activity.service';
import { BonusActivityDialogComponent } from './dialogs/bonus-activity-dialog/bonus-activity-dialog.component';
import { BreaksActivityDialogComponent } from './dialogs/breaks-activity-dialog/breaks-activity-dialog.component';
import { ActivityTemporaryWorkersComponent } from './activity-content/activity-temporary-workers/activity-temporary-workers.component';
import { AddTemporaryWorkerDialogComponent } from './dialogs/add-temporary-worker-dialog/add-temporary-worker-dialog.component';
import { AddActivityTemporaryWorkerDialogComponent } from './dialogs/add-activity-temporary-worker-dialog/add-activity-temporary-worker-dialog.component';
import { DeleteTemporaryWorkerDialogComponent } from './dialogs/delete-temporary-worker-dialog/delete-temporary-worker-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'activity',
    component: ActivityComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: ActivityService }
  },
  {
    path: 'activity/interim',
    component: ActivityComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: ActivityService }
  }
];

@NgModule({
  declarations: [
    ActivityComponent,
    ActivitySidebarComponent,
    ActivityContentComponent,
    AddActivityDialogComponent,
    ActivityEmployeesCountersComponent,
    BonusActivityDialogComponent,
    BreaksActivityDialogComponent,
    ActivityTemporaryWorkersComponent,
    AddTemporaryWorkerDialogComponent,
    AddActivityTemporaryWorkerDialogComponent,
    DeleteTemporaryWorkerDialogComponent
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
    MatDatetimepickerModule,
    MatMomentDatetimeModule,
    MatTableModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
    MatSortModule,

    FuseSidebarModule,
    FuseSharedModule,

    NgxDatatableModule,
    CustomConfirmDialogModule
  ],
  entryComponents: [
    AddActivityDialogComponent,
    BonusActivityDialogComponent,
    BreaksActivityDialogComponent,
    AddTemporaryWorkerDialogComponent,
    AddActivityTemporaryWorkerDialogComponent,
    DeleteTemporaryWorkerDialogComponent
  ]
})
export class ActivityModule {
}
