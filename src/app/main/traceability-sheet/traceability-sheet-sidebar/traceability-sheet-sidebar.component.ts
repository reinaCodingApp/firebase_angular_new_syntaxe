import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { TraceabilitySheetService } from '../traceability-sheet.service';
import { Site } from 'app/common/models/site';
import { SheetRequestParameter } from 'app/main/traceability-sheet/models/sheetRequestParameter';

@Component({
  selector: 'traceability-sheet-sidebar',
  templateUrl: './traceability-sheet-sidebar.component.html',
  styleUrls: ['./traceability-sheet-sidebar.component.scss']
})
export class TraceabilitySheetSidebarComponent implements OnInit {
  sheetRequestParameter: SheetRequestParameter;
  sites: Site[];
  weeks: number[];
  years: number[];

  constructor(
    private _traceabilitySheetService: TraceabilitySheetService,
    private _loaderService: NgxUiLoaderService
  ) {
    this.sheetRequestParameter = new SheetRequestParameter();
  }

  ngOnInit(): void {
    this._traceabilitySheetService.onYearsChanged.subscribe((years) => {
      this.years = years;
    });
    this._traceabilitySheetService.onWeeksChanged.subscribe((weeks) => {
      this.weeks = weeks;
    });
    this._traceabilitySheetService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
    });
    this.initValues();
  }

  getTraceabilitySheet(): void {
    this._loaderService.start();
    this._traceabilitySheetService.getTraceabilitySheet(this.sheetRequestParameter)
      .subscribe((traceabilitySheet) => {
        this._traceabilitySheetService.onCurrentYearChanged.next(this.sheetRequestParameter.year);
        this._traceabilitySheetService.onCurrentTraceabilitySheet.next(traceabilitySheet);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  initValues(): void {
    this.sheetRequestParameter.year = this.years[0];
    this.sheetRequestParameter.week = this.weeks[0];
    this.sheetRequestParameter.site = this.sites[0];
  }

}



