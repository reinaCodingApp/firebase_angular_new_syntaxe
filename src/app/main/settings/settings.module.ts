import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTable, MatHeaderRow, MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
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
