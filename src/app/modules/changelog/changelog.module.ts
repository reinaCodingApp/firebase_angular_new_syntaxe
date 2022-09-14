import { NgModule } from '@angular/core';
import { ChangelogComponent } from './changelog.component';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ChangelogService } from './changelog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { AddVersionDialogComponent } from './dialogs/add-version-dialog/add-version-dialog.component';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'changelog',
    component: ChangelogComponent, // ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: ChangelogService }
  }
];

@NgModule({
  declarations: [ChangelogComponent, AddVersionDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
    MatMenuModule
  ],
  entryComponents: [AddVersionDialogComponent]
})
export class ChangelogModule { }
