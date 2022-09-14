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
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { FollowupSheetService } from './followup-sheet.service';
import { FollowupSheetComponent } from './followup-sheet.component';
import { AddSimpletaskDialogComponent } from './dialogs/add-simpletask-dialog/add-simpletask-dialog.component';
import { FollowupSheetRecapComponent } from './followup-sheet-recap/followup-sheet-recap.component';
import { FollowupSheetConfigurationComponent } from './followup-sheet-configuration/followup-sheet-configuration.component';
import { AddEmployeelevelDialogComponent } from './followup-sheet-configuration/dialogs/add-employeelevel-dialog/add-employeelevel-dialog.component';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'app/shared/shared.module';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module';
import { FollowupSheetContentComponent } from './followup-sheet-content/followup-sheet-content.component';
import { MatSidenavModule } from '@angular/material/sidenav';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  {
    path: '',
    component: FollowupSheetComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: FollowupSheetService },
    children: [
      {
        path: '',
        component: FollowupSheetContentComponent,
        resolve: { resolve: FollowupSheetService },
      },
      {
        path: 'getLastRecap',
        component: FollowupSheetRecapComponent,
        resolve: { resolve: FollowupSheetService }
      },
      {
        path: 'getSheetRecap',
        component: FollowupSheetRecapComponent,
        resolve: { resolve: FollowupSheetService },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      }
        
    ]
  },

  {
    path: 'followupSheet-configuration',
    component: FollowupSheetConfigurationComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: FollowupSheetService }
  },
  
];

@NgModule({
  declarations: [
    FollowupSheetComponent,
    AddSimpletaskDialogComponent,
    FollowupSheetRecapComponent,
    FollowupSheetConfigurationComponent,
    AddEmployeelevelDialogComponent,
    FollowupSheetContentComponent
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
    MatExpansionModule,
    CustomConfirmDialogModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    SharedPipesModule,
    MatSidenavModule
  ],
  entryComponents: [
    AddSimpletaskDialogComponent,
    AddEmployeelevelDialogComponent
  ]
})
export class FollowupSheetModule {
}
