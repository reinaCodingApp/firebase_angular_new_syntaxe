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
import { SharedModule } from 'app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']); 
const routes: Routes = [
  
  {
    path: '',
    component: WebMessagesComponent, 
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: WebMessagesService },
    children: [
      {
        path: 'discussions',
        component: WebMessagesComponent, 
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'discussions/:id',
        component: WebMessagesComponent, 
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'frauds',
        component: WebMessagesComponent, 
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'frauds/:id',
        component: WebMessagesComponent, 
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'closed',
        component: WebMessagesComponent, 
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'closed/:id',
        component: WebMessagesComponent,
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'filter/:departmentId',
        component: WebMessagesComponent,
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'filter/:departmentId/:id',
        component: WebMessagesComponent,
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'search/:searchInput',
        component: WebMessagesComponent,
        resolve: { resolve: WebMessagesService }
      },
      {
        path: 'search/:searchInput/:id',
        component: WebMessagesComponent,
        resolve: { resolve: WebMessagesService }
      },
    
    ]
  },
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
    SharedModule,
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
    CustomConfirmDialogModule,
    MatSidenavModule
  ]
})
export class WebMessagesModule {
}
