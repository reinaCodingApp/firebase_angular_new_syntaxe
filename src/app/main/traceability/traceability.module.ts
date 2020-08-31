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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';

import { TraceabilityComponent } from './traceability.component';
import { TraceabilityService } from './traceability.service';
import { TraceabilitySidebarComponent } from './traceability-sidebar/traceability-sidebar.component';
import { TraceabilityContentComponent } from './traceability-content/traceability-content.component';
import { AddTraceabilityDialogComponent } from './dialogs/add-traceability-dialog/add-traceability-dialog.component';
import { AddExceptioncodeDialogComponent } from './dialogs/add-exceptioncode-dialog/add-exceptioncode-dialog.component';
import { PrintWeeksDialogComponent } from './dialogs/print-weeks-dialog/print-weeks-dialog.component';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { TraceabiliyCodesOfweekComponent } from './dialogs/traceabiliy-codes-ofweek/traceabiliy-codes-ofweek.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'traceability',
    component: TraceabilityComponent,
    ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TraceabilityService }
  }
];

@NgModule({
  declarations: [
    TraceabilityComponent,
    TraceabilitySidebarComponent,
    TraceabilityContentComponent,
    AddTraceabilityDialogComponent,
    AddExceptioncodeDialogComponent,
    PrintWeeksDialogComponent,
    TraceabiliyCodesOfweekComponent
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
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatTooltipModule,
    MatMenuModule,
    MatRadioModule,
    FuseSidebarModule,
    FuseSharedModule,
    CustomConfirmDialogModule
  ],
  entryComponents: [
    AddTraceabilityDialogComponent,
    AddExceptioncodeDialogComponent,
    PrintWeeksDialogComponent,
    TraceabiliyCodesOfweekComponent
  ]
})
export class TraceabilityModule {
}
