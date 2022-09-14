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
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../../shared/shared.module';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UsersComponent } from './users/users.component';
import { UserFormDialogComponent } from './users/dialogs/user-form-dialog/user-form-dialog.component';
import { UsersService } from './users/users.service';
import { SettingsService } from './settings.service';
import { SettingsComponent } from './settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: SettingsService }
  }];

@NgModule({
  declarations: [UsersComponent, UserFormDialogComponent, SettingsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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

  ],
  exports: [UsersComponent],
  //providers: [AngularFireFunctions, UsersService],
  // entryComponents: [UserFormDialogComponent]
})
export class SettingsModule { }
