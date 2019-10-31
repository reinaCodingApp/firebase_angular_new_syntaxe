import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostsService } from '../../posts.service';
import { Category } from 'app/models/category';
@Component({
    selector   : 'contacts-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class ContactsMainSidebarComponent implements OnInit, OnDestroy
{
    user: any;
    filterBy: string = null;
    categories: Array<Category>;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private postsService: PostsService
    )
    {
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void
    {

        this.postsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });
        this.postsService.getCategories().subscribe(result => {
              this.categories = result;
            });
    }
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    changeFilter(filter): void
    {
        this.filterBy = filter;
        this.postsService.onFilterChanged.next(this.filterBy);
    }
}
