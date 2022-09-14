import { Component, OnInit } from '@angular/core';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import * as moment from 'moment';
import { ForeignMissionService } from '../foreign-mission.service';
import { Month } from '../models/month';

@Component({
  selector: 'foreign-mission-sidebar',
  templateUrl: './foreign-mission-sidebar.component.html'
})
export class ForeignMissionSidebarComponent implements OnInit {
  months: Month[];
  years: number[];
  year: number;
  month: number;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _foreignMissionService: ForeignMissionService
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
    
    this._foreignMissionService.getMissions(this.month, this.year)
      .subscribe(foreignMissions => {
        this._foreignMissionService.onForeignMissionsChanged.next(foreignMissions);
      }, (err) => {
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


