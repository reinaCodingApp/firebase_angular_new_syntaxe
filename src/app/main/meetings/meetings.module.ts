import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MeetingsComponent } from './meetings.component';
import { MeetingsService } from './meetings.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { AddDecisionDialogComponent } from './dilaogs/add-decision-dialog/add-decision-dialog.component';
import { GenerateTaskDialogComponent } from './dilaogs/generate-task-dialog/generate-task-dialog.component';
import { DecisionsComponent } from './decisions/decisions.component';
import { HistoryComponent } from './history/history.component';
import { TasksComponent } from './tasks/tasks.component';
import { LogsComponent } from './logs/logs.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReaffectTaskDialogComponent } from './dilaogs/reaffect-task-dialog/reaffect-task-dialog.component';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'meetings',
    component: MeetingsComponent,
    // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MeetingsService }
  },
  {
    path: 'meetings/:instanceId',
    component: MeetingsComponent,
    // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MeetingsService }
  }
];

@NgModule({
  declarations: [
    MeetingsComponent,
    AddDecisionDialogComponent,
    GenerateTaskDialogComponent,
    DecisionsComponent,
    HistoryComponent,
    TasksComponent,
    LogsComponent,
    ReaffectTaskDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    MatBadgeModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule,
    NgxDatatableModule,
    SharedPipesModule,
    CustomConfirmDialogModule,
    MatMenuModule,

    FuseSidebarModule,
    FuseSharedModule
  ],
  entryComponents: [
    AddDecisionDialogComponent,
    GenerateTaskDialogComponent,
    ReaffectTaskDialogComponent
  ]
})
export class MeetingsModule {
}
