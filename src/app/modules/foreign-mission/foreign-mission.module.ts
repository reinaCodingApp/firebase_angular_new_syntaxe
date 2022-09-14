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
import { ForeignMissionComponent } from './foreign-mission.component';
import { ForeignMissionSidebarComponent } from './foreign-mission-sidebar/foreign-mission-sidebar.component';
import { ForeignMissionContentComponent } from './foreign-mission-content/foreign-mission-content.component';
import { AddForeignMissionDialogComponent } from './dialogs/add-foreign-mission-dialog/add-foreign-mission-dialog.component';
import { ForeignMissionService } from './foreign-mission.service';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  { 
    path: '', 
    component: ForeignMissionComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: ForeignMissionService },
    children: [
      {
        path: '',
        component: ForeignMissionContentComponent
      }
    ]
  }
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

    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSidenavModule,
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
    CustomConfirmDialogModule,
    FormsModule,
    MatDialogModule,
    MatNativeDateModule,
  ]
})
export class ForeignMissionModule {
}
