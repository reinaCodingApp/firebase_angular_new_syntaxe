import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MeetingsService } from '../meetings.service';
import { SmallSheet } from 'app/main/followup-sheet/models/smallSheet';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FilterParameter } from 'app/main/meetings/models/filterParameter';
import { MeetInstance } from 'app/main/meetings/models/meetInstance';
import { SimpleTaskItem } from 'app/main/meetings/models/simpleTaskItem';
import { CommonService } from 'app/common/services/common.service';

@Component({
  selector: 'meetings-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HistoryComponent implements OnInit {
  currentInstance: MeetInstance;
  latestWeeks: SmallSheet[];
  currentWeek: SmallSheet;
  filterTaskItemsParameter: FilterParameter;
  filterInput: string = null;
  taskItems: SimpleTaskItem[] = [];

  constructor(
    private _meetingsService: MeetingsService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    public commonService: CommonService
  ) {
    this.filterTaskItemsParameter = new FilterParameter();
  }

  ngOnInit(): void {
    this._meetingsService.meetingsViewModel.subscribe((meetingsViewModel) => {
      this.latestWeeks = meetingsViewModel.latestWeeks;
      this.currentInstance = meetingsViewModel.currentInstance;
    });
  }

  findTaskItems(): void {
    this._loaderService.start();
    this.filterTaskItemsParameter = {
      filter: this.filterInput === '' ? null : this.filterInput,
      sheet: this.currentWeek,
      currentInstance: this.currentInstance
    };
    this._meetingsService.findTaskItems(this.filterTaskItemsParameter)
      .subscribe((taskItems) => {
        this._loaderService.stop();
        this.taskItems = taskItems;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  getCommentsTaskItem(taskItem: SimpleTaskItem, taskItemIndex: number): void{
    this._loaderService.start();
    this._meetingsService.getCommentsTaskItem(taskItem.id)
      .subscribe((comments) => {
        this._loaderService.stop();
        this.taskItems[taskItemIndex].comments = comments;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

}

