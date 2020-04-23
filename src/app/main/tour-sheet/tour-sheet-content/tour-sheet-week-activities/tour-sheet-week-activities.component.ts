import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TourSheetActivityRow } from 'app/main/tour-sheet/models/tourSheetActivityRow';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'tour-sheet-week-activities',
  templateUrl: './tour-sheet-week-activities.component.html',
  styleUrls: ['./tour-sheet-week-activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TourSheetWeekActivitiesComponent implements OnInit {
  @Input() weekActivities: TourSheetActivityRow[];

  displayedColumns = ['site', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor() { }

  ngOnInit(): void {
  }

}
