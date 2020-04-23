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
import { MatDatepickerModule, MatTableModule, MatTabsModule, MatExpansionModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';

import { TechnicalSheetComponent } from './technical-sheet.component';
import { TechnicalSheetService } from './technical-sheet.service';
import { TechnicalSheetSidebarComponent } from './technical-sheet-sidebar/technical-sheet-sidebar.component';
import { TechnicalSheetListComponent } from './technical-sheet-list/technical-sheet-list.component';
import { TechnicalSheetItemComponent } from './technical-sheet-list/technical-sheet-item/technical-sheet-item.component';
import { TechnicalSheetDetailsComponent } from './technical-sheet-details/technical-sheet-details.component';
import { AddTechnicalSheetDialogComponent } from './dilaogs/add-technical-sheet-dialog/add-technical-sheet-dialog.component';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TechnicalSheetConfigurationComponent } from './technical-sheet-configuration/technical-sheet-configuration.component';
import { AddProviderDialogComponent } from './technical-sheet-configuration/dialogs/add-provider-dialog/add-provider-dialog.component';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'technicalSheet',
    component: TechnicalSheetComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TechnicalSheetService }
  },
  {
    path: 'technicalSheet-configuration',
    component: TechnicalSheetConfigurationComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TechnicalSheetService }
  }
];

@NgModule({
  declarations: [
    TechnicalSheetComponent,
    TechnicalSheetSidebarComponent,
    TechnicalSheetListComponent,
    TechnicalSheetItemComponent,
    TechnicalSheetDetailsComponent,
    AddTechnicalSheetDialogComponent,
    TechnicalSheetConfigurationComponent,
    AddProviderDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),

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
    MatExpansionModule,
    FuseWidgetModule,
    CustomConfirmDialogModule,

    TranslateModule,

    FuseSharedModule,
    FuseSidebarModule
  ],
  entryComponents: [
    AddTechnicalSheetDialogComponent,
    AddProviderDialogComponent
  ]
})
export class TechnicalSheetModule {
}
