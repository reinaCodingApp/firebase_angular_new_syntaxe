import { AuditsService } from '../audit/audit.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { AccessRightsComponent } from './access-rights.component';
import { AccessRightsService } from './access-rights.service';
import { ModulesComponent } from './modules/modules.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatToolbarModule, MatStepperModule, MatDatepickerModule, MatDialogModule, MatTooltipModule, MatCheckboxModule, MatTableModule, MatMenuModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';
import { AddModuleDialogComponent } from './modules/dialogs/add-module-dialog/add-module-dialog.component';
import { ClonePermissionsDialogComponent } from './dialogs/clone-permissions-dialog/clone-permissions-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes = [
  {
    path: 'access-rights/:userId',
    component: AccessRightsComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AccessRightsService
    }
  },
  {
    path: 'settings/modules',
    component: ModulesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
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
    SatPopoverModule,
    SharedPipesModule,

    FuseSharedModule,
    FuseSidebarModule,
    FuseWidgetModule
  ],
  providers: [AccessRightsService],
  entryComponents: [AddModuleDialogComponent, ClonePermissionsDialogComponent]
})
export class AccessRightsModule { }
