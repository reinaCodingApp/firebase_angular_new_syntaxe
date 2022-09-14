import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SitesSidebarRightComponent } from './sites-sidebar-right/sites-sidebar-right.component';
import { SitesSidebarLeftComponent } from './sites-sidebar-left/sites-sidebar-left.component';
import { SitesContentComponent } from './sites-content/sites-content.component';
import { SitesComponent } from './sites.component';
import { SitesService } from './sites.service';
import { AddSiteDialogComponent } from './dialogs/add-site-dialog/add-site-dialog.component';
import { CustomChipListComponent } from './custom-chip-list/custom-chip-list.component';
import { SiteDetailsDialogComponent } from './dialogs/site-details-dialog/site-details-dialog.component';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';


const redirectUnauthorizedToLoginPage = () => redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: '',
    component: SitesComponent, 
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: SitesService },
    children: [
      {
        path: '',
        component: SitesContentComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    SitesComponent,
    SitesSidebarRightComponent,
    SitesSidebarLeftComponent,
    SitesContentComponent,
    AddSiteDialogComponent,
    CustomChipListComponent,
    SiteDetailsDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    MatTableModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    CustomConfirmDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule
    
  ],
  entryComponents: [
    AddSiteDialogComponent,
    SiteDetailsDialogComponent
  ]
})
export class SitesModule { }
