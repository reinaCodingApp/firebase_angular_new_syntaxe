import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ContactsContactListComponent } from './contact-list/contact-list.component';
import { ContactsMainSidebarComponent } from './sidebars/main/main.component';
import { ContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import { PostsService } from './posts.service';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'posts', component: PostsComponent, ...canActivate(redirectUnauthorizedToLoginPage), resolve: {resolve: PostsService} },
  {path: 'posts/:uid', component: PostComponent}

];

@NgModule({
  declarations: [PostsComponent,
    PostComponent,
    ContactsContactListComponent,
    ContactsMainSidebarComponent,
    ContactsContactFormDialogComponent],
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
  ],
  providers: [],
  entryComponents: [
    ContactsContactFormDialogComponent
  ]
})
export class PostsModule { }
