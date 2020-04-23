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
import { MatTableModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RecapActivityComponent } from './recap-activity.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { RecapActivityService } from './recap-activity.service';
import { RecapActivitySidebarComponent } from './recap-activity-sidebar/recap-activity-sidebar.component';
import { RecapActivityContentComponent } from './recap-activity-content/recap-activity-content.component';
import { DatePipe } from '@angular/common';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'recapActivity', component: RecapActivityComponent, ...canActivate(redirectUnauthorizedToLoginPage), resolve: { resolve: RecapActivityService } }
];

@NgModule({
  declarations: [
    RecapActivityComponent,
    RecapActivitySidebarComponent,
    RecapActivityContentComponent
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

    FuseSidebarModule,
    FuseSharedModule,

    NgxDatatableModule
  ],
  providers: [DatePipe]
})
export class RecapActivityModule {
}
