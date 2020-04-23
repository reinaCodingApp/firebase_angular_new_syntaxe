import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostsService } from '../../posts.service';
import { Category } from 'app/main/webcms/posts/models/category';
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
        console.log('filter categorie ', filter);
        this.filterBy = filter;
        this.postsService.onFilterChanged.next(this.filterBy);
    }
}
