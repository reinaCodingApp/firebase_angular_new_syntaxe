import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivityStatisticsComponent } from "../activity-statistics.component";
import { ActivityStatisticsService } from "../activity-statistics.service";
import { StatViewModel } from "../models/statViewModel";

@Component({
  selector: "activity-statistics-content",
  templateUrl: "./activity-statistics-content.component.html",
})
export class ActivityStatisticsContentComponent implements OnInit {
  stats: StatViewModel;
  showDataCentiemeFormat: boolean;
  constructor(
    public activityStatistics: ActivityStatisticsComponent,
    private _activityStatisticsService: ActivityStatisticsService
  ) {}

  ngOnInit(): void {
    this._activityStatisticsService.onStatsChanged.subscribe((stats) => {
      console.log(stats);
      this.stats = stats;
    });
    this._activityStatisticsService.onShowDataCentiemeFormat.subscribe(
      (showDataCentiemeFormat) => {
        this.showDataCentiemeFormat = showDataCentiemeFormat;
      }
    );
  }
}
