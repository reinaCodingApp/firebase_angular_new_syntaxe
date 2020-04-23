import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';

@Component({
  selector: 'app-traceability-sheet',
  templateUrl: './traceability-sheet.component.html',
  styleUrls: ['./traceability-sheet.component.scss']
})
export class TraceabilitySheetComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit() {
  }

}
