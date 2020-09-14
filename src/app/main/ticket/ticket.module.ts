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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

import { TicketService } from './ticket.service';
import { AddTicketDialogComponent } from './dialogs/add-ticket-dialog/add-ticket-dialog.component';
import { AssignTicketDialogComponent } from './dialogs/assign-ticket-dialog/assign-ticket-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmployeeTicketsComponent } from './employee-tickets/employee-tickets.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeTicketDetailsComponent } from './employee-tickets/employee-ticket-details/employee-ticket-details.component';
import { AdminTicketsComponent } from './admin-tickets/admin-tickets.component';
import { AdminTicketsSidebarComponent } from './admin-tickets/admin-tickets-sidebar/admin-tickets-sidebar.component';
import { TicketsListComponent } from './admin-tickets/tickets-list/tickets-list.component';
import { TicketListItemComponent } from './admin-tickets/tickets-list/ticket-list-item/ticket-list-item.component';
import { TicketDetailsComponent } from './admin-tickets/ticket-details/ticket-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedPipesModule } from 'app/pipes/shared-pipes.module';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'employee-tickets',
    component: EmployeeTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'employee-tickets/:id',
    component: EmployeeTicketDetailsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/pending',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/pending/:id',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/closed',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/closed/:id',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/urgent',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/urgent/:id',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/filter/:serviceId',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/filter/:serviceId/:id',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/search/:searchInput',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets/search/:searchInput/:id',
    component: AdminTicketsComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: TicketService }
  },
  {
    path: 'admin-tickets',
    redirectTo: 'admin-tickets/pending',
    resolve: { resolve: TicketService }
  }
];

@NgModule({
  declarations: [
    AddTicketDialogComponent,
    AssignTicketDialogComponent,
    EmployeeTicketsComponent,
    EmployeeTicketDetailsComponent,
    AdminTicketsComponent,
    AdminTicketsSidebarComponent,
    TicketsListComponent,
    TicketListItemComponent,
    TicketDetailsComponent
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
    MatSlideToggleModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatTableModule,
    MatMenuModule,
    SharedPipesModule,
    MatTooltipModule,
    MatProgressSpinnerModule,

    FuseSidebarModule,
    FuseSharedModule,
    FuseWidgetModule,

    NgxDatatableModule,
    InfiniteScrollModule
  ],
  entryComponents: [
    AddTicketDialogComponent,
    AssignTicketDialogComponent
  ]
})
export class TicketModule {
}
