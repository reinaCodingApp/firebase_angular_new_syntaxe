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
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ForeignMissionComponent } from './foreign-mission.component';
import { ForeignMissionSidebarComponent } from './foreign-mission-sidebar/foreign-mission-sidebar.component';
import { ForeignMissionContentComponent } from './foreign-mission-content/foreign-mission-content.component';
import { AddForeignMissionDialogComponent } from './dialogs/add-foreign-mission-dialog/add-foreign-mission-dialog.component';
import { ForeignMissionService } from './foreign-mission.service';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'foreignMission', component: ForeignMissionComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
  resolve: { resolve: ForeignMissionService } }
];

@NgModule({
  declarations: [
    ForeignMissionComponent,
    ForeignMissionSidebarComponent,
    ForeignMissionContentComponent,
    AddForeignMissionDialogComponent
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
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    NgxMatSelectSearchModule,

    FuseSidebarModule,
    FuseSharedModule,

    NgxDatatableModule
  ],
  entryComponents: [
    AddForeignMissionDialogComponent
  ]
})
export class ForeignMissionModule {
}
