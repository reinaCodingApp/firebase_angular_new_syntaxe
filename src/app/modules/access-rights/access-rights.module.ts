import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { AccessRightsComponent } from './access-rights.component';
import { AccessRightsService } from './access-rights.service';
import { ModulesComponent } from './modules/modules.component';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { AddModuleDialogComponent } from './modules/dialogs/add-module-dialog/add-module-dialog.component';
import { ClonePermissionsDialogComponent } from './dialogs/clone-permissions-dialog/clone-permissions-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SatPopoverModule } from '@ncstate/sat-popover';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);

const routes: Route[] = [
  {
    path: ':userId',
    component: AccessRightsComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: {
      main: AccessRightsService
    }  
  },
  {
    path: 'settings/modules',
    component: ModulesComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: {
      main: AccessRightsService
    },
  }
];

@NgModule({
  declarations: [
    ModulesComponent,
    AccessRightsComponent,
    AddModuleDialogComponent,
    ClonePermissionsDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatStepperModule,
    MatDatepickerModule,
    MatStepperModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTableModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
    SharedModule,
    SatPopoverModule,

  ],
  providers: [AccessRightsService],
  entryComponents: [AddModuleDialogComponent, ClonePermissionsDialogComponent]
})
export class AccessRightsModule { }
