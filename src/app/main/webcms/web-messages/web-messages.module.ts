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

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { WebMessagesService } from './web-messages.service';
import { MailDetailsComponent } from './mail-details/mail-details.component';
import { MailMainSidebarComponent } from './sidebars/main/main-sidebar.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WebMessagesComponent } from './web-messages.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailListItemComponent } from './mail-list/mail-list-item/mail-list-item.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'webcms/discussions',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/discussions/:id',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/frauds',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/frauds/:id',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/closed',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/closed/:id',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/filter/:departmentId',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/filter/:departmentId/:id',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/search/:searchInput',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },
  {
    path: 'webcms/search/:searchInput/:id',
    component: WebMessagesComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebMessagesService }
  },

  {
    path: 'webcms',
    redirectTo : 'webcms/discussions',
    resolve: { resolve: WebMessagesService }
  }
];

@NgModule({
  declarations: [
    WebMessagesComponent,
    MailListComponent,
    MailListItemComponent,
    MailDetailsComponent,
    MailMainSidebarComponent
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
    InfiniteScrollModule,
    MatProgressSpinnerModule,

    TranslateModule,
    CustomConfirmDialogModule,

    FuseSharedModule,
    FuseSidebarModule
  ]
})
export class WebMessagesModule {
}
