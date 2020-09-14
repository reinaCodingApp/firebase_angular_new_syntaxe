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
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ActivityTemporaryWorkerComponent } from './activity-temporary-workers.component';
import { ActivitySidebarComponent } from './activity-sidebar/activity-sidebar.component';
import { ActivityContentComponent } from './activity-content/activity-content.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ActivityTemporaryWorkerService } from './activity-temporary-workers.service';
import { BonusActivityDialogComponent } from './dialogs/bonus-activity-dialog/bonus-activity-dialog.component';
import { BreaksActivityDialogComponent } from './dialogs/breaks-activity-dialog/breaks-activity-dialog.component';
import { ActivityTemporaryWorkersComponent } from './activity-content/activity-temporary-workers/activity-temporary-workers.component';
import { AddTemporaryWorkerDialogComponent } from './dialogs/add-temporary-worker-dialog/add-temporary-worker-dialog.component';
import { AddActivityTemporaryWorkerDialogComponent } from './dialogs/add-activity-temporary-worker-dialog/add-activity-temporary-worker-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { UpdateActivityDialogComponent } from './dialogs/update-activity-dialog/update-activity-dialog.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'activity/interim',
    component: ActivityTemporaryWorkerComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: ActivityTemporaryWorkerService }
  }
];

@NgModule({
  declarations: [
    ActivityTemporaryWorkerComponent,
    ActivitySidebarComponent,
    ActivityContentComponent,
    BonusActivityDialogComponent,
    BreaksActivityDialogComponent,
    ActivityTemporaryWorkersComponent,
    AddTemporaryWorkerDialogComponent,
    AddActivityTemporaryWorkerDialogComponent,
    UpdateActivityDialogComponent
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
    MatTooltipModule,
    FuseSidebarModule,
    FuseSharedModule,

    NgxDatatableModule,
    CustomConfirmDialogModule
  ],
  entryComponents: [
    BonusActivityDialogComponent,
    BreaksActivityDialogComponent,
    AddTemporaryWorkerDialogComponent,
    AddActivityTemporaryWorkerDialogComponent,
    UpdateActivityDialogComponent
  ]
})
export class ActivityTemporaryWorkerModule {
}
