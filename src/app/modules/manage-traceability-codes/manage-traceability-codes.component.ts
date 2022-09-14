import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ManageTraceabilityCodesService } from './manage-traceability-codes.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { RequestParameter } from './models/requestParameter';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'manage-traceability-codes',
  templateUrl: './manage-traceability-codes.component.html'
})
export class ManageTraceabilityCodesComponent implements OnInit {
  @ViewChild(MatSort , {static:true}) sort: MatSort;
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;
  codes: any[];
  totalElements: number;
  total: number;
  pageNumber: number;
  pageSize: number;
  requestParameter: RequestParameter;

  loadingIndicator: boolean;
  reorderable: boolean;
  smallScreen: boolean;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['date', 'code', 'isAnExceptionCode', 'site'];

  constructor(
    private _manageTraceabilityCodes: ManageTraceabilityCodesService,
    private breakpointObserver: BreakpointObserver) {
    this.loadingIndicator = true;
    this.reorderable = false;
  }

  ngOnInit(): void {
    this.paginator.hidePageSize = true;
    this._manageTraceabilityCodes.onrequestParameterChanged.subscribe((requestParameter) => {
      this.requestParameter = requestParameter;
      this.pageNumber = this.requestParameter.startIndex;
      this.requestParameter.length = 30;
      console.log(this.requestParameter)
    });
    this._manageTraceabilityCodes.onCodesChanged.subscribe((results) => {
      this.loadingIndicator = false;
      this.totalElements = results.queryRecords;
      this.total = results.totalRecords;
      this.codes = results.data;
      this.dataSource = new MatTableDataSource(this.codes);
      this.dataSource.sort = this.sort; 
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        const start = page * pageSize + 1;
        const end = (page + 1) * pageSize;
        return `[${start} à ${end}] sur un total de ${length} éléments`;
      };
    });
    this.breakpointObserver
    .observe(['(min-width: 600px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.smallScreen = false;
      } else {
        this.smallScreen = true;
      }
    });

    this._manageTraceabilityCodes.onrequestParameterChanged.subscribe((requestParameter) => {
      this.requestParameter = requestParameter;
      this.pageNumber = this.requestParameter.startIndex;
      this.pageSize = this.requestParameter.length;
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
        this.dataSource = new MatTableDataSource(this.codes);
      });
  }

  setPage(pageInfo): void {
    this.pageNumber = pageInfo.offset;
    this.getCodes(this.pageNumber * this.requestParameter.length);
  }
  pageChanged(event: PageEvent) {
    this.getCodes(event.pageIndex);
  }
}
