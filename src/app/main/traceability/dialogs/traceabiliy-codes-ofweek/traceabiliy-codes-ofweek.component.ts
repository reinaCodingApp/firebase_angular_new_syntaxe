import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { TraceabilityService } from '../../traceability.service';
import { ReferenceCode } from 'app/main/traceability/models/descending/referenceCode';
import { TraceabilityMaterial } from 'app/main/traceability/models/traceabilityMaterial';
import { TraceabilityPlanification } from 'app/main/traceability/models/descending/traceabilityPlanification';
import { RequestParameter } from 'app/main/traceability/models/descending/requestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { PaginationParameter } from '../../models/paginationParameter';
import { TraceabilityWeekCode } from '../../models/descending/traceabilityWeekCode';

@Component({
  selector: 'app-traceabiliy-codes-ofweek',
  templateUrl: './traceabiliy-codes-ofweek.component.html',
  styleUrls: ['./traceabiliy-codes-ofweek.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TraceabiliyCodesOfweekComponent implements OnInit {
  traceabilityPlanification: TraceabilityPlanification;
  shapes: TraceabilityMaterial[];
  codes: ReferenceCode[] = [];
  traceabilityWeekCode: TraceabilityWeekCode;
  habilitation: Habilitation = new Habilitation(0);

  total: number;
  paginationParameter: PaginationParameter;
  opened: boolean;
  searchInput = '';
  lastSearchInput = '';
  requestParameter: RequestParameter;
  codeMode = 'fromCodes';

  constructor(
    public matDialogRef: MatDialogRef<TraceabiliyCodesOfweekComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _traceabilityService: TraceabilityService,
    private _notificationService: SharedNotificationService
  ) {
    this.traceabilityWeekCode = new TraceabilityWeekCode();
    this.traceabilityPlanification = data.traceabilityPlanification;
  }

  ngOnInit(): void {
    this._traceabilityService.onCodesChanged.subscribe((codes) => {
      this.codes = codes;
    });
    this._traceabilityService.onShapesChanged.subscribe((shapes) => {
      this.shapes = shapes;
    });
    this._traceabilityService.onLastSearchInputChanged.subscribe((lastSearchInput) => {
      this.lastSearchInput = lastSearchInput;
    });
    this._traceabilityService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
    this.initAvailableCodes();
  }

  addCode(): void {
    this.traceabilityWeekCode.traceabilityPlanificationId = this.traceabilityPlanification.id;
    this.traceabilityWeekCode.code = this.traceabilityWeekCode.code.toUpperCase();
    if (this.traceabilityPlanification.traceabilityWeekCodes === null) {
      this.traceabilityPlanification.traceabilityWeekCodes = [];
    }
    this._traceabilityService.addTraceabilityWeekCode(this.traceabilityWeekCode)
      .subscribe((addedTraceabilityWeekCode) => {
        this.traceabilityPlanification.traceabilityWeekCodes.push(addedTraceabilityWeekCode);
      }, (err) => {
        this._notificationService.showStandarError();
      });
  }

  deleteTraceabilityWeekCode(traceabilityWeekCode: TraceabilityWeekCode): void {
    this._traceabilityService.deleteTraceabilityWeekCode(traceabilityWeekCode)
      .subscribe((response) => {
        if (response) {
          this.traceabilityPlanification.traceabilityWeekCodes = this.traceabilityPlanification.traceabilityWeekCodes.filter((item => item.id !== traceabilityWeekCode.id));
        }
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  getNextCodes(): void {
    this.paginationParameter.start += this.paginationParameter.length;
    this._traceabilityService.getAvailablesCodes(this.paginationParameter)
      .subscribe((result: any) => {
        this.codes.push(...result.data);
        this.total = result.total;
      }, err => {
        console.log(err);
      });
  }

  searchCode(searchInput: string): void {
    this.paginationParameter.start = 0;
    this.paginationParameter.searchInput = searchInput;
    this._traceabilityService.getAvailablesCodes(this.paginationParameter)
      .subscribe((result: any) => {
        if (this.opened) {
          this.codes = result.data;
          this.total = result.total;
        }
      }, err => {
        console.log(err);
      });
  }

  initAvailableCodes(): void {
    this.paginationParameter = {
      start: 0,
      searchInput: this.lastSearchInput,
      length: 50
    };
    this._traceabilityService.getAvailablesCodes(this.paginationParameter)
      .subscribe((result: any) => {
        this.codes = result.data;
        this.total = result.total;
      }, err => {
        console.log(err);
      });
  }

  openedChange(opened: boolean): void {
    this.opened = opened;
    if (!this.opened) {
      this.lastSearchInput = this.searchInput;
      this._traceabilityService.onLastSearchInputChanged.next(this.lastSearchInput);
    } else {
      this.searchInput = this.lastSearchInput;
      this.initAvailableCodes();
    }
  }
}





