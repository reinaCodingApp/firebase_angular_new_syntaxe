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
import { MatTableModule } from '@angular/material/table';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { TraceabilitySheetService } from './traceability-sheet.service';
import { TraceabilitySheetComponent } from './traceability-sheet.component';
import { TraceabilitySheetSidebarComponent } from './traceability-sheet-sidebar/traceability-sheet-sidebar.component';
import { TraceabilitySheetContentComponent } from './traceability-sheet-content/traceability-sheet-content.component';
import { AddSheetItemDialogComponent } from './add-sheet-item-dialog/add-sheet-item-dialog.component';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'traceabilitySheet',
    component: TraceabilitySheetComponent,
    // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TraceabilitySheetService }
  }
];

@NgModule({
  declarations: [
    TraceabilitySheetComponent,
    TraceabilitySheetSidebarComponent,
    TraceabilitySheetContentComponent,
    AddSheetItemDialogComponent
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

    FuseSidebarModule,
    FuseSharedModule
  ],
  entryComponents: [
    AddSheetItemDialogComponent
  ]
})
export class TraceabilitySheetModule {
}
