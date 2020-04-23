import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './posts.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { PostComponent } from './post/post.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ContactsMainSidebarComponent } from './sidebars/main/main.component';
import { AddPostDialogComponent } from './dialogs/add-post-dialog/add-post-dialog.component';
import { PostsService } from './posts.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatSelectModule } from '@angular/material';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'posts', component: PostsComponent, ...canActivate(redirectUnauthorizedToLoginPage), resolve: { resolve: PostsService } },
  { path: 'posts/:uid', component: PostComponent }

];

@NgModule({
  declarations: [PostsComponent,
    PostComponent,
    PostsListComponent,
    ContactsMainSidebarComponent,
    AddPostDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,

    AngularEditorModule,
    CustomConfirmDialogModule
  ],
  providers: [],
  entryComponents: [
    AddPostDialogComponent
  ]
})
export class PostsModule { }
