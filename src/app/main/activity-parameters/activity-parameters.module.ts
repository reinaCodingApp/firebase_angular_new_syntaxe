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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ActivityParametersComponent } from './activity-parameters.component';
import { ActivityParametersService } from './activity-parameters.service';
import { ParametersSettingsComponent } from './parameters-settings/parameters-settings.component';
import { ParametersHolidaysComponent } from './parameters-holidays/parameters-holidays.component';
import { AddHolidayDialogComponent } from './parameters-holidays/dialogs/add-holiday-dialog/add-holiday-dialog.component';
import { ParametersEmployeesComponent } from './parameters-employees/parameters-employees.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'activityParameters', component: ActivityParametersComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
  resolve: { resolve: ActivityParametersService } }
];

@NgModule({
  declarations: [
    ActivityParametersComponent,
    ParametersSettingsComponent,
    ParametersHolidaysComponent,
    AddHolidayDialogComponent,
    ParametersEmployeesComponent
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
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    FuseSidebarModule,
    FuseSharedModule
  ],
  entryComponents: [
    AddHolidayDialogComponent
  ]
})
export class ActivityParametersModule {
}
