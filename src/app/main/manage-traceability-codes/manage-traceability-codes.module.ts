import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ManageTraceabilityCodesComponent } from './manage-traceability-codes.component';
import { ManageTraceabilityCodesService } from './manage-traceability-codes.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'manageTraceabilityCodes',
    component: ManageTraceabilityCodesComponent
    , ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: ManageTraceabilityCodesService }
  }
];

@NgModule({
  declarations: [
    ManageTraceabilityCodesComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    NgxDatatableModule,

    FuseSidebarModule,
    FuseSharedModule
  ],
})
export class ManageTraceabilityCodesModule {
}
