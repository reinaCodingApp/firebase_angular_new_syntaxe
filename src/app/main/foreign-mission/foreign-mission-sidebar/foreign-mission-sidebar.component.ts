import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { ForeignMissionService } from '../foreign-mission.service';
import { Month } from 'app/main/foreign-mission/models/month';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'foreign-mission-sidebar',
  templateUrl: './foreign-mission-sidebar.component.html',
  styleUrls: ['./foreign-mission-sidebar.component.scss']
})
export class ForeignMissionSidebarComponent implements OnInit {
  months: Month[];
  years: number[];
  year: number;
  month: number;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _foreignMissionService: ForeignMissionService,
    private _loaderService: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this._foreignMissionService.onPossibleYearsChanged.subscribe((years) => {
      this.years = years;
    });
    this._foreignMissionService.onMonthsChanged.subscribe((months) => {
      this.months = months;
    });
    this._foreignMissionService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
    this.initValues();
  }

  getMissions(): void {
    this._loaderService.start();
    this._foreignMissionService.getMissions(this.month, this.year)
      .subscribe((foreignMissions) => {
        this._foreignMissionService.onForeignMissionsChanged.next(foreignMissions);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  initValues(): void {
    this.year = +moment(Date.now()).year();
    this.month = +moment(Date.now()).month() + 1;
    this._foreignMissionService.filterParams.year = this.year;
    this._foreignMissionService.filterParams.month = this.month;
  }

}


