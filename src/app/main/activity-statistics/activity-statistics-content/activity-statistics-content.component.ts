import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivityStatisticsService } from '../activity-statistics.service';
import { StatViewModel } from 'app/main/activity-statistics/models/statViewModel';

@Component({
  selector: 'activity-statistics-content',
  templateUrl: './activity-statistics-content.component.html',
  styleUrls: ['./activity-statistics-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityStatisticsContentComponent implements OnInit {
  stats: StatViewModel;
  showDataCentiemeFormat: boolean;
  constructor(private _activityStatisticsService: ActivityStatisticsService) { }

  ngOnInit(): void {
    this._activityStatisticsService.onStatsChanged.subscribe((stats) => {
      console.log(stats);
      this.stats = stats;
    });
    this._activityStatisticsService.onShowDataCentiemeFormat
      .subscribe((showDataCentiemeFormat) => {
        this.showDataCentiemeFormat = showDataCentiemeFormat;
      });
  }

}
