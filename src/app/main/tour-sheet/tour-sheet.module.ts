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
import { MatTableModule } from '@angular/material/table';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { TourSheetComponent } from './tour-sheet.component';
import { TourSheetSidebarComponent } from './tour-sheet-sidebar/tour-sheet-sidebar.component';
import { TourSheetContentComponent } from './tour-sheet-content/tour-sheet-content.component';
import { TourSheetService } from './tour-sheet.service';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { TourSheetWeekstatsComponent } from './tour-sheet-content/tour-sheet-weekstats/tour-sheet-weekstats.component';
import { TourSheetWeekActivitiesComponent } from './tour-sheet-content/tour-sheet-week-activities/tour-sheet-week-activities.component';
import { TourSheetCheckedcodesComponent } from './tour-sheet-content/tour-sheet-checkedcodes/tour-sheet-checkedcodes.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'tourSheet', component: TourSheetComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
  resolve: { resolve: TourSheetService } }
];

@NgModule({
  declarations: [
    TourSheetComponent,
    TourSheetSidebarComponent,
    TourSheetContentComponent,
    TourSheetWeekstatsComponent,
    TourSheetWeekActivitiesComponent,
    TourSheetCheckedcodesComponent,
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
    NgxMatSelectSearchModule,

    FuseSidebarModule,
    FuseSharedModule
  ]
})
export class TourSheetModule {
}
