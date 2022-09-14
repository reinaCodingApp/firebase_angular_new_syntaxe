import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TonnageComponent } from './tonnage.component';
import { TonnageService } from './tonnage.service';
import { TonnageListComponent } from './tonnage-list/tonnage-list.component';
import { TonnageItemComponent } from './tonnage-list/tonnage-item/tonnage-item.component';
import { TonnageDetailsComponent } from './tonnage-details/tonnage-details.component';
import { AddTonnageDialogComponent } from './dialogs/add-tonnage-dialog/add-tonnage-dialog.component';
import { TonnageSidebarComponent } from './tonnage-sidebar/tonnage-sidebar.component';
import { TonnageStatsComponent } from './tonnage-stats/tonnage-stats.component';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { AddTonnageDetailsDialogComponent } from './dialogs/add-tonnage-details-dialog/add-tonnage-details-dialog.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  {
    path: '',
    component: TonnageComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: TonnageService }
  }
];

@NgModule({
  declarations: [
    TonnageComponent,
    TonnageSidebarComponent,
    TonnageListComponent,
    TonnageItemComponent,
    TonnageDetailsComponent,
    AddTonnageDialogComponent,
    TonnageStatsComponent,
    AddTonnageDetailsDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    CustomConfirmDialogModule,
    MatSidenavModule
    
  ],
  entryComponents: [
    AddTonnageDialogComponent,
    AddTonnageDetailsDialogComponent
  ]
})
export class TonnageModule {
}
