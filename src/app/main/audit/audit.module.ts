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
import { MatToolbarModule, MatDatepickerModule, MatStepperModule, MatDialogModule, MatTooltipModule, MatMenuModule, MatChipsModule, MatAutocompleteModule } from '@angular/material';
import { AuditAdministrationComponent } from './audit-administration/audit-administration.component';
import { AuditEditTemplateComponent } from './audit-edit-template/audit-edit-template.component';
import { AuditPossibleValuesComponent } from './audit-possible-values/audit-possible-values.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes = [
    {
        path     : 'audits',
        component: AuditListComponent,  ...canActivate(redirectUnauthorizedToLoginPage),
        resolve  : {
            main: AuditsService
        }
    },
    {
        path     : 'audit-detail/:auditId',
        component: AuditDetailComponent, ...canActivate(redirectUnauthorizedToLoginPage),
        resolve  : {
            main: AuditsService
        }
    },
    {
      path     : 'audits/administration',
      component: AuditAdministrationComponent,  ...canActivate(redirectUnauthorizedToLoginPage),
      resolve  : {
          main: AuditsService
      },
    },
    {
      path     : 'audits/administration/:templateId',
      component: AuditEditTemplateComponent,  ...canActivate(redirectUnauthorizedToLoginPage),
      resolve  : {
          main: AuditsService
      },
    },
    {
      path     : 'audits/possibleValues',
      component: AuditPossibleValuesComponent,  ...canActivate(redirectUnauthorizedToLoginPage),
      resolve  : {
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
        AuditPossibleValuesComponent
    ],
    imports     : [
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

        FuseSharedModule,
        FuseSidebarModule,
    ],
    providers   : [
        AuditsService
    ],
    entryComponents: [AddAuditDialogComponent]
})
export class AuditModule { }
