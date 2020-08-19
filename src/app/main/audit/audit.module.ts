import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { AuditListComponent } from './audit-list/audit-list.component';
import { AuditsService } from './audit.service';
import { AuditDetailComponent } from './audit-detail/audit-detail.component';
import { AddAuditDialogComponent } from './dialogs/add-audit-dialog/add-audit-dialog.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MatToolbarModule, MatDatepickerModule, MatStepperModule, MatDialogModule, MatTooltipModule, MatMenuModule, MatChipsModule, MatAutocompleteModule, MatDividerModule } from '@angular/material';
import { AuditAdministrationComponent } from './audit-administration/audit-administration.component';
import { AuditEditTemplateComponent } from './audit-edit-template/audit-edit-template.component';
import { AuditPossibleValuesComponent } from './audit-possible-values/audit-possible-values.component';
import { AuditPolesComponent } from './audit-poles/audit-poles.component';
import { AuditPrintComponent } from './audit-print/audit-print.component';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module';
import { AddPoleMemberComponent } from './dialogs/add-pole-member/add-pole-member.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ValidateAuditDialogComponent } from './dialogs/validate-audit-dialog/validate-audit-dialog.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes = [
  {
    path: 'audits/:poleId',
    component: AuditListComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    }
  },
  {
    path: 'audit-detail/:auditId',
    component: AuditDetailComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    }
  },
  {
    path: 'audits-administration/:poleId',
    component: AuditAdministrationComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    },
  },
  {
    path: 'audits-templates/:templateId',
    component: AuditEditTemplateComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    },
  },
  {
    path: 'audits-possibleValues',
    component: AuditPossibleValuesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    }
  },
  {
    path: 'audit-poles',
    component: AuditPolesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    }
  },
  {
    path: 'audit-print/:auditId',
    component: AuditPrintComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: {
      main: AuditsService
    }
  }
];

@NgModule({
  declarations: [
    AuditListComponent,
    AuditDetailComponent,
    AddAuditDialogComponent,
    AuditAdministrationComponent,
    AuditEditTemplateComponent,
    AuditPossibleValuesComponent,
    AuditPolesComponent,
    AuditPrintComponent,
    AddPoleMemberComponent,
    ValidateAuditDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
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
    MatMenuModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule,
    NgxMatSelectSearchModule,
    SharedPipesModule,

    FuseSharedModule,
    FuseSidebarModule,
  ],
  providers: [
    AuditsService
  ],
  entryComponents: [AddAuditDialogComponent, AddPoleMemberComponent, ValidateAuditDialogComponent]
})
export class AuditModule { }
