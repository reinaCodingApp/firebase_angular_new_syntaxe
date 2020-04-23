import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MeetingsService } from '../meetings.service';
import { SmallSheet } from 'app/main/followup-sheet/models/smallSheet';
import { MeetingSector } from 'app/main/meetings/models/meetingSector';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FilterParameter } from 'app/main/meetings/models/filterParameter';
import { MeetInstance } from 'app/main/meetings/models/meetInstance';
import { Decision } from 'app/main/meetings/models/decision';
import { CommonService } from 'app/common/services/common.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'meetings-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DecisionsComponent implements OnInit {
  currentInstance: MeetInstance;
  latestWeeks: SmallSheet[];
  currentWeek: SmallSheet;
  sectors: MeetingSector[];
  currentSector: MeetingSector;
  filterParameter: FilterParameter;
  filterInput: string = null;
  decisions: Decision[] = [];

  constructor(
    private _meetingsService: MeetingsService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    public commonService: CommonService
  ) {
    this.filterParameter = new FilterParameter();
  }

  ngOnInit(): void {
    this._meetingsService.meetingsViewModel.subscribe((meetingsViewModel) => {
      this.latestWeeks = meetingsViewModel.latestWeeks;
      this.sectors = meetingsViewModel.sectors;
      this.currentInstance = meetingsViewModel.currentInstance;
    });
  }

  getDecisions(): void {
    this._loaderService.start();
    this.filterParameter = {
      filter: this.filterInput === '' ? null : this.filterInput,
      sheet: this.currentWeek,
      sector: this.currentSector,
      currentInstance: this.currentInstance
    };
    this._meetingsService.getDecisions(this.filterParameter)
      .subscribe((decisions) => {
        this._loaderService.stop();
        this.decisions = decisions;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

}
