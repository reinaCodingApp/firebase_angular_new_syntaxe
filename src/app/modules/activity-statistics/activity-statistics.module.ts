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
import { MatTableModule } from '@angular/material/table';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ActivityStatisticsComponent } from './activity-statistics.component';
import { ActivityStatisticsSidebarComponent } from './activity-statistics-sidebar/activity-statistics-sidebar.component';
import { ActivityStatisticsContentComponent } from './activity-statistics-content/activity-statistics-content.component';
import { ActivityStatisticsService } from './activity-statistics.service';
import { StatsMissionAbroadComponent } from './activity-statistics-content/stats-mission-abroad/stats-mission-abroad.component';
import { StatsOvertimeDetailsComponent } from './activity-statistics-content/stats-overtime-details/stats-overtime-details.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  { 
    path: '', component: ActivityStatisticsComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: ActivityStatisticsService } }
];

@NgModule({
  declarations: [
    ActivityStatisticsComponent,
    ActivityStatisticsSidebarComponent,
    ActivityStatisticsContentComponent,
    StatsMissionAbroadComponent,
    StatsOvertimeDetailsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
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
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    MatSidenavModule
  ]
})
export class ActivityStatisticsModule {
}
