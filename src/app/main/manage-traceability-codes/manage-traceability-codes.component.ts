import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ManageTraceabilityCodesService } from './manage-traceability-codes.service';
import { fuseAnimations } from '@fuse/animations';
import { RequestParameter } from 'app/main/manage-traceability-codes/models/tequestParameter';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'manage-traceability-codes',
  templateUrl: './manage-traceability-codes.component.html',
  styleUrls: ['./manage-traceability-codes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ManageTraceabilityCodesComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  pageSizeOptions = [10, 25, 50, 100];
  codes: any[];
  totalElements: number;
  total: number;
  pageNumber: number;
  requestParameter: RequestParameter;

  loadingIndicator: boolean;
  reorderable: boolean;
  constructor(private _manageTraceabilityCodes: ManageTraceabilityCodesService) {
    this.loadingIndicator = true;
    this.reorderable = false;
  }

  ngOnInit(): void {
    this._manageTraceabilityCodes.onrequestParameterChanged.subscribe((requestParameter) => {
      this.requestParameter = requestParameter;
      this.pageNumber = this.requestParameter.startIndex;
      this.requestParameter.length = 10;
    });
    this._manageTraceabilityCodes.onCodesChanged.subscribe((results) => {
      this.loadingIndicator = false;
      this.totalElements = results.queryRecords;
      this.total = results.totalRecords;
      this.codes = results.data;
    });
  }

  getCodes(pageNumber: number = 0): void {
    this.loadingIndicator = true;
    this.requestParameter.startIndex = pageNumber;
    this._manageTraceabilityCodes.getCodes(this.requestParameter)
      .subscribe(results => {
        this.loadingIndicator = false;
        this.totalElements = results.queryRecords;
        this.total = results.totalRecords;
        this.codes = results.data;
        if (this.table && this.requestParameter.startIndex === 0) {
          this.table.offset = 0;
        }
      });
  }

  setPage(pageInfo): void {
    this.pageNumber = pageInfo.offset;
    this.getCodes(this.pageNumber * this.requestParameter.length);
  }

}
