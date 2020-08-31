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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { FollowupSheetService } from './followup-sheet.service';
import { FollowupSheetComponent } from './followup-sheet.component';
import { AddSimpletaskDialogComponent } from './dialogs/add-simpletask-dialog/add-simpletask-dialog.component';
import { FollowupSheetRecapComponent } from './followup-sheet-recap/followup-sheet-recap.component';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module';
import { FollowupSheetConfigurationComponent } from './followup-sheet-configuration/followup-sheet-configuration.component';
import { AddEmployeelevelDialogComponent } from './followup-sheet-configuration/dialogs/add-employeelevel-dialog/add-employeelevel-dialog.component';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'followupSheet',
    component: FollowupSheetComponent,
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: FollowupSheetService }
  },
  {
    path: 'getLastRecap',
    component: FollowupSheetRecapComponent,
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: FollowupSheetService }
  },
  {
    path: 'followupSheet/getSheetRecap',
    component: FollowupSheetRecapComponent,
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: FollowupSheetService },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
    {
    path: 'FollowupSheet/GetSheetRecap',
    component: FollowupSheetRecapComponent,
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: FollowupSheetService },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'followupSheet-configuration',
    component: FollowupSheetConfigurationComponent,
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: FollowupSheetService }
  },
];

@NgModule({
  declarations: [
    FollowupSheetComponent,
    AddSimpletaskDialogComponent,
    FollowupSheetRecapComponent,
    FollowupSheetConfigurationComponent,
    AddEmployeelevelDialogComponent
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
    MatExpansionModule,
    SharedPipesModule,
    FuseWidgetModule,
    CustomConfirmDialogModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    FuseSidebarModule,
    FuseSharedModule
  ],
  entryComponents: [
    AddSimpletaskDialogComponent,
    AddEmployeelevelDialogComponent
  ]
})
export class FollowupSheetModule {
}
