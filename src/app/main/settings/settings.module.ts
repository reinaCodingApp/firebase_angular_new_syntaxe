import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTable, MatHeaderRow, MatHeaderRowDef, MatTableModule, MatMenuModule, MatToolbarModule, MatChipsModule, MatAutocompleteModule, MatSelectModule, MatTabsModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UsersComponent } from './users/users.component';
import { UserFormDialogComponent } from './users/dialogs/user-form-dialog/user-form-dialog.component';
import { UsersService } from './users/users.service';
import { GroupNotificationsComponent } from './users/group-notifications/group-notifications.component';
import { SettingsService } from './settings.service';
import { SettingsComponent } from './settings.component';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'settings',
    component: UsersComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: SettingsService }
  }];

@NgModule({
  declarations: [UsersComponent, UserFormDialogComponent, GroupNotificationsComponent, SettingsComponent],
  imports: [
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatToolbarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTabsModule,
    NgxMatSelectSearchModule,

    FuseSharedModule
  ],
  exports: [UsersComponent],
  providers: [AngularFireFunctions, UsersService],
  entryComponents: [UserFormDialogComponent]
})
export class SettingsModule { }
