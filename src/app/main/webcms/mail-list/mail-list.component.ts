import { Component, OnDestroy, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { WebcmsService } from '../webcms.service';
import { Discussion } from 'app/main/webcms/models/discussion';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MailListComponent implements OnInit, OnDestroy {
  @Input() isScrolling: boolean;
  @Input() completed: boolean;
  @Output() getMore: EventEmitter<any> = new EventEmitter();
  discussions: Discussion[];
  counters: any;
  currentDiscussion: Discussion;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _mailService: WebcmsService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to update mails on changes
    this._mailService.onDiscussionsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedDiscussions => {
        this.discussions = paginatedDiscussions.discussions;
      });

    this._mailService.onCountersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(counters => {
        this.counters = counters;
      });

    // Subscribe to update current mail on changes
    this._mailService.onCurrentDiscussionChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currentDiscussion => {
        if (!currentDiscussion) {
          // Set the current mail id to null to deselect the current mail
          this.currentDiscussion = null;
        }
        else {
          this.currentDiscussion = currentDiscussion;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  readMail(mailId): void {
    this._mailService.getDiscussionDetails(mailId).then(() => {
      const url = this.activatedRoute.snapshot.url.join('/');
      this.location.go('/' + url + '/' + mailId);
      const foundIndex = this.discussions.findIndex(d => d.id === mailId);
      if (!this.discussions[foundIndex].read) {
        this.discussions[foundIndex].read = true;
        if (!this.discussions[foundIndex].isFraud) {
          this.counters = {
            count1: (this.counters.count1 !== 0) ? this.counters.count1 - 1 : this.counters.count1,
            count2: this.counters.count2
          };
        } else {
          this.counters = {
            count2: (this.counters.count2 !== 0) ? this.counters.count2 - 1 : this.counters.count2,
            count1: this.counters.count1
          };
        }
        this._mailService.onCountersChanged.next(this.counters);
      }
      this.discussions[foundIndex].unreadCommentsCount = 0;
    });
  }
}
