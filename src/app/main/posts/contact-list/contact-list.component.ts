import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { PostsService } from '../posts.service';
import { ContactsContactFormDialogComponent } from '../contact-form/contact-form.component';
import { Post } from 'app/models/post';

@Component({
    selector     : 'contacts-contact-list',
    templateUrl  : './contact-list.component.html',
    styleUrls    : ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;
    posts: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['date', 'title'];
    selectedContacts: any[];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

   constructor(private postsService: PostsService, public _matDialog: MatDialog)
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this.postsService);
        this.postsService.onPostsChanged.subscribe(result => {
          this.posts = result;
        });
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    popupSelectPost(post): void
    {
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                post: post
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const post = response[1] as Post;
                console.log('get post', post);
                switch ( actionType )
                {
                    case 'save':
                      {
                        console.log('post', post);
                        this.postsService.editPost(post);
                        break;
                      }

                    case 'delete':
                       {
                        // this.deletePost(post);
                        break;
                       }
                }
            });
    }
  }

export class FilesDataSource extends DataSource<any>
{
    constructor(private _contactsService: PostsService)
    {
        super();
    }

    connect(): Observable<any[]>
    {
        return this._contactsService.onPostsChanged;
    }

    disconnect(): void
    {
    }
}
