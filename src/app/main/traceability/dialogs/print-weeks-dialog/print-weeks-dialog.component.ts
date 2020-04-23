import { MainTools } from 'app/common/tools/main-tools';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { TraceabilityService } from '../../traceability.service';
import { Traceability } from 'app/main/traceability/models/descending/traceability';
import { NgForm } from '@angular/forms';
import { TraceabilityPlanification } from 'app/main/traceability/models/descending/traceabilityPlanification';
import { Site } from 'app/common/models/site';
import { RequestParameter } from 'app/main/traceability/models/descending/requestParameter';
import { CommonService } from 'app/common/services/common.service';
import * as moment from 'moment';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';


@Component({
  selector: 'app-print-weeks-dialog',
  templateUrl: './print-weeks-dialog.component.html',
  styleUrls: ['./print-weeks-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintWeeksDialogComponent implements OnInit {
  traceabilityPlanifications: TraceabilityPlanification[] = [];
  traceability: Traceability;
  weeks: number[];
  years: number[];
  sites: Site[];
  selectedSite: Site;
  requestParameter: RequestParameter;

  constructor(
    public matDialogRef: MatDialogRef<PrintWeeksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _traceabilityService: TraceabilityService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    this.selectedSite = new Site();
    this.requestParameter = new RequestParameter();
  }

  ngOnInit(): void {
    this.weeks = EmbeddedDatabase.weeks;
    this._traceabilityService.onYearsChanged.subscribe((years) => {
      this.years = years;
    });
    this._traceabilityService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
    });
    this.initValues();
  }

  printWeeks(form: NgForm): void {
    if (form.valid) {
      if (this.requestParameter.weekEnd - this.requestParameter.weekStart <= 10) {
        this.requestParameter.siteId = this.selectedSite.id;
        this._loaderService.start();
        this._traceabilityService.printWeeks(this.requestParameter)
          .subscribe((traceabilityPlanifications) => {
            this.traceabilityPlanifications = traceabilityPlanifications;
            setTimeout(() => {
              MainTools.printFromHtml('printWeeksContent');
              this._loaderService.stop();
            }, 500);
          }, (err) => {
            console.log(err);
            this._loaderService.stop();
            this._notificationService.showStandarError();
          });
      } else {
        this._notificationService.showWarning('Le nombre entre les semaines doit être inférieur à 10');
      }

    }
  }

  getDateforYearAndWeek(week: number, year: number): string {
    return moment().year(year)
      .week(week)
      .day('lundi').format('DD/MM/YYYY');
  }

  getWeekFromDate(date: any): number {
    return moment(date).week();
  }

  initValues(): void {
    this.requestParameter.weekStart = +moment().format('W');
    this.requestParameter.weekEnd = this.requestParameter.weekStart;
    this.requestParameter.year = +moment().format('YYYY');
    this.selectedSite = this.sites[0];
  }

}

