import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TourSheetService } from '../tour-sheet.service';
import { fuseAnimations } from '@fuse/animations';
import { WeekStats } from 'app/main/tour-sheet/models/weekStats';
import { TourSheetActivityRow } from 'app/main/tour-sheet/models/tourSheetActivityRow';
import { CheckedCode } from 'app/main/traceability/models/checkedCode';
import { WeekStatsSimplified } from 'app/main/tour-sheet/models/WeekStatsSimplified';

@Component({
  selector: 'tour-sheet-content',
  templateUrl: './tour-sheet-content.component.html',
  styleUrls: ['./tour-sheet-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TourSheetContentComponent implements OnInit {
  weekStats: WeekStatsSimplified[];
  weekActivities: TourSheetActivityRow[];
  checkedCodes: CheckedCode[];

  constructor(private _tourSheetService: TourSheetService) { }

  ngOnInit(): void {
    this._tourSheetService.onTourSheetActivityListChanged
      .subscribe((tourSheetActivityList) => {
        if (tourSheetActivityList) {
          this.weekStats = this.simplifiedWeekStats(tourSheetActivityList.weekStats);
          this.weekActivities = tourSheetActivityList.weekActivitiesRoadMapViewModelRows;
          this.checkedCodes = tourSheetActivityList.checkedCodes;
        }
      });
  }

  simplifiedWeekStats(weekStats: WeekStats): WeekStatsSimplified[] {
    const weekStatsSimplifiedList: WeekStatsSimplified[] = [];
    const row1: WeekStatsSimplified = {
      label: 'Début',
      monday: weekStats.monday.startDateStr,
      tuesday: weekStats.tuesday.startDateStr,
      wednesday: weekStats.wednesday.startDateStr,
      thursday: weekStats.thursday.startDateStr,
      friday: weekStats.friday.startDateStr,
      saturday: weekStats.saturday.startDateStr,
      totalWeek: weekStats.totalWeekStr
    };
    const row2: WeekStatsSimplified = {
      label: 'Fin',
      monday: weekStats.monday.endDateStr,
      tuesday: weekStats.tuesday.endDateStr,
      wednesday: weekStats.wednesday.endDateStr,
      thursday: weekStats.thursday.endDateStr,
      friday: weekStats.friday.endDateStr,
      saturday: weekStats.saturday.endDateStr
    };
    const row3: WeekStatsSimplified = {
      label: 'Temps site',
      monday: weekStats.monday.totalWeekOnSiteStr,
      tuesday: weekStats.tuesday.totalWeekOnSiteStr,
      wednesday: weekStats.wednesday.totalWeekOnSiteStr,
      thursday: weekStats.thursday.totalWeekOnSiteStr,
      friday: weekStats.friday.totalWeekOnSiteStr,
      saturday: weekStats.saturday.totalWeekOnSiteStr,
      totalWeek: weekStats.totalWeekOnSiteStr
    };
    const row4: WeekStatsSimplified = {
      label: 'Pauses',
      monday: weekStats.monday.totalBreaksStr,
      tuesday: weekStats.tuesday.totalBreaksStr,
      wednesday: weekStats.wednesday.totalBreaksStr,
      thursday: weekStats.thursday.totalBreaksStr,
      friday: weekStats.friday.totalBreaksStr,
      saturday: weekStats.saturday.totalBreaksStr,
      totalWeek: weekStats.totalBreaksStr
    };
    weekStatsSimplifiedList.push(row1, row2, row3, row4);
    return weekStatsSimplifiedList;
  }

}
