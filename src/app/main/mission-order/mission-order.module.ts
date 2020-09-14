import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { MissionOrderService } from './mission-order.service';
import { MissionOrderComponent } from './mission-order.component';
import { MissionOrderSidebarComponent } from './mission-order-sidebar/mission-order-sidebar.component';
import { MissionOrderListComponent } from './mission-order-list/mission-order-list.component';
import { MissionOrderItemComponent } from './mission-order-list/mission-order-item/mission-order-item.component';
import { MissionOrderDetailsComponent } from './mission-order-details/mission-order-details.component';
import { AddMissionOrderComponent } from './dialogs/add-mission-order/add-mission-order.component';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'missionOrder',
    component: MissionOrderComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MissionOrderService }
  }
];

@NgModule({
  declarations: [
    MissionOrderComponent,
    MissionOrderSidebarComponent,
    MissionOrderListComponent,
    MissionOrderItemComponent,
    MissionOrderDetailsComponent,
    AddMissionOrderComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatCardModule,
    MatStepperModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    InfiniteScrollModule,
    TranslateModule,
    MatProgressSpinnerModule,

    FuseSharedModule,
    FuseSidebarModule,

    AngularEditorModule
  ],
  providers: [
    MissionOrderService
  ],
  entryComponents: [
    AddMissionOrderComponent
  ]
})
export class MissionOrderModule {
}
