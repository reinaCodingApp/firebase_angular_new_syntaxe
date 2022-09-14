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
import { ActivityComponent } from './activity.component';
import { ActivitySidebarComponent } from './activity-sidebar/activity-sidebar.component';
import { ActivityContentComponent } from './activity-content/activity-content.component';
import { AddActivityDialogComponent } from './dialogs/add-activity-dialog/add-activity-dialog.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ActivityService } from './activity.service';
import { BonusActivityDialogComponent } from './dialogs/bonus-activity-dialog/bonus-activity-dialog.component';
import { BreaksActivityDialogComponent } from './dialogs/breaks-activity-dialog/breaks-activity-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  {
    path: '',
    component: ActivityComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: ActivityService }
  }
];

@NgModule({
  declarations: [
    ActivityComponent,
    ActivitySidebarComponent,
    ActivityContentComponent,
    AddActivityDialogComponent,
    BonusActivityDialogComponent,
    BreaksActivityDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSidenavModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    MatTooltipModule,
    SatPopoverModule,
    CustomConfirmDialogModule,
    [NgxMatTimepickerModule.setLocale('fr-FR')]
  ],
  entryComponents: [
    AddActivityDialogComponent,
    BonusActivityDialogComponent,
    BreaksActivityDialogComponent,
  ],
  providers:[
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
  ]
})
export class ActivityModule {
}
