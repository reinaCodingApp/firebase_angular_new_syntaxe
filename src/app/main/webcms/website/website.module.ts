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
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WebsiteComponent } from './website.component';
import { WebsiteService } from './website.service';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { WelcomeService } from './components/welcome-page/welcome.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostsComponent } from './components/posts/posts.component';
import { AddPostDialogComponent } from './components/posts/add-post-dialog/add-post-dialog.component';
import { PostsService } from './components/posts/posts.service';
import { ContactsMainSidebarComponent } from './components/posts/sidebars/main/main.component';
import { PostsListComponent } from './components/posts/posts-list/posts-list.component';
import { PostComponent } from './components/posts/post/post.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { FaqComponent } from './components/faq/faq.component';
import { FaqService } from './components/faq/faq.service';
import { NewsComponent } from './components/news/news.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { FocusComponent } from './components/focus/focus.component';
import { NewFocusComponent } from './components/focus/new-focus/new-focus.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'website',
    component: WebsiteComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebsiteService }
  },
  {
    path: 'website/posts',
    component: NewPostComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebsiteService }
  },
  {
    path: 'website/focuses',
    component: NewFocusComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: WebsiteService }
  },
];

@NgModule({
  declarations: [
    WebsiteComponent,
    WelcomePageComponent,
    PostsComponent,
    PostComponent,
    PostsListComponent,
    ContactsMainSidebarComponent,
    AddPostDialogComponent,
    FaqComponent,
    NewsComponent,
    NewPostComponent,
    FocusComponent,
    NewFocusComponent
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
    MatTabsModule,
    CustomConfirmDialogModule,
    DragDropModule,
    MatTableModule,
    MatSlideToggleModule,
    CKEditorModule,
    CustomConfirmDialogModule,
    MatDatepickerModule,
    SatPopoverModule,
    MatRadioModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDividerModule,
    FuseWidgetModule,

    FuseSharedModule,
    FuseSidebarModule,
  ],
  providers: [WelcomeService, PostsService, FaqService],
  entryComponents: [
    AddPostDialogComponent
  ]
})
export class WebSiteModule {
}
