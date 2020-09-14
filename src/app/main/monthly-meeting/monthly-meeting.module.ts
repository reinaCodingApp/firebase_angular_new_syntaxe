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
import { MatTableModule } from '@angular/material/table';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MonthlyMeetingComponent } from './monthly-meeting.component';
import { MonthlyMeetingService } from './monthly-meeting.service';
import { AddMonthlyMeetingDialogComponent } from './dialogs/add-monthly-meeting-dialog/add-monthly-meeting-dialog.component';
import { MonthlyMeetingDetailsComponent } from './monthly-meeting-details/monthly-meeting-details.component';
import { AddPresenceDialogComponent } from './monthly-meeting-details/dialogs/add-presence-dialog/add-presence-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'monthlyMeeting',
    component: MonthlyMeetingComponent,
    // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MonthlyMeetingService }
  },
  {
    path: 'monthlyMeeting/details/:id',
    component: MonthlyMeetingDetailsComponent,
    // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MonthlyMeetingService }
  }
];

@NgModule({
  declarations: [
    MonthlyMeetingComponent,
    AddMonthlyMeetingDialogComponent,
    MonthlyMeetingDetailsComponent,
    AddPresenceDialogComponent
,
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
    MatTableModule,
    FuseWidgetModule,
    MatDatetimepickerModule,
    MatMomentDatetimeModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    FuseSidebarModule,
    FuseSharedModule
  ],
  entryComponents: [
    AddMonthlyMeetingDialogComponent,
    AddPresenceDialogComponent
  ]
})
export class MonthlyMeetingModule {
}
