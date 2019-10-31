import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Post } from 'app/models/post';
import { Category } from 'app/models/category';
import { PostsService } from './posts.service';
import $ from 'jquery';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'contacts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PostsComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    posts: Array<Post> = [];


    private _unsubscribeAll: Subject<any>;
    constructor(
        private _contactsService: PostsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void
    {
        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._contactsService.onSearchTextChanged.next(searchText);
            });
        this._contactsService.onPostsChanged.subscribe(posts => {
              console.log('articles ', posts);
              this.posts = posts;
            });
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    newContact(): void
    {
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

                this._contactsService.updateContact(response.getRawValue());
            });
    }
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
