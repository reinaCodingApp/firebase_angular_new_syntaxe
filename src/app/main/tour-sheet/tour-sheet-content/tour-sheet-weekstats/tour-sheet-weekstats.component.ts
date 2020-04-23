import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { WeekStatsSimplified } from 'app/main/tour-sheet/models/WeekStatsSimplified';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'tour-sheet-weekstats',
  templateUrl: './tour-sheet-weekstats.component.html',
  styleUrls: ['./tour-sheet-weekstats.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TourSheetWeekstatsComponent implements OnInit {
  @Input() weekStats: WeekStatsSimplified;

  displayedColumns = ['label', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'totalWeek'];

  constructor() { }

  ngOnInit(): void {
  }

}
