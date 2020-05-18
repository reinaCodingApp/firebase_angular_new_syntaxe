import { NgModule } from '@angular/core';
import { ChangelogComponent } from './changelog.component';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ChangelogService } from './changelog.service';
import { MatIconModule, MatButtonModule, MatTooltipModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { AddVersionDialogComponent } from './dialogs/add-version-dialog/add-version-dialog.component';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'changelog',
    component: ChangelogComponent, ...canActivate(redirectUnauthorizedToLoginPage),
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
    FuseSharedModule,
    MatMenuModule
  ],
  entryComponents: [AddVersionDialogComponent]
})
export class ChangelogModule { }
