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
import { MatStepperModule, MatDatepickerModule, MatTabsModule, MatTableModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ClientsComponent } from './clients.component';
import { ClientsService } from './clients.service';
import { ClientsDetailsComponent } from './clients-details/clients-details.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientsItemComponent } from './clients-list/clients-item/clients-item.component';
import { AddClientDialogComponent } from './dialogs/add-client-dialog/add-client-dialog.component';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'clients',
    component: ClientsComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: ClientsService }
  }
];

@NgModule({
  declarations: [
    ClientsComponent,
    ClientsDetailsComponent,
    ClientsListComponent,
    ClientsItemComponent,
    AddClientDialogComponent
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
    MatTabsModule,
    MatTableModule,

    FuseSharedModule,
    FuseSidebarModule,

    AngularEditorModule
  ],
  entryComponents: [
    AddClientDialogComponent
  ]
})
export class ClientsModule {
}
