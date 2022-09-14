import { Component, OnInit, Input } from '@angular/core';
import { OverTimeDetails } from '../../models/overTimeDetails';

@Component({
  selector: 'stats-overtime-details',
  templateUrl: './stats-overtime-details.component.html'
})
export class StatsOvertimeDetailsComponent implements OnInit {
  @Input() statsOvertimeDetails: OverTimeDetails[];
  displayedColumns = ['weekNumber', 'totalWorkedHours', 'totalOverTimeHours', 'partialTaux', 'dates'];

  constructor() { }

  ngOnInit() {
  }

}
