import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecapActivityService } from '../recap-activity.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivitiesByRegionRow } from '../models/activitiesByRegionRow';

@Component({
  selector: 'recap-activity-content',
  templateUrl: './recap-activity-content.component.html'
})
export class RecapActivityContentComponent implements OnInit {
  activities: ActivitiesByRegionRow[];
  displayedColumns = ['site', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  constructor(private _recapActivityService: RecapActivityService) { }

  ngOnInit(): void {
    this._recapActivityService.onActivitiesChanged
      .subscribe((activitiesByRegionViewModel) => {
        if (activitiesByRegionViewModel.activitiesByRegionRows) {
          this.activities = activitiesByRegionViewModel.activitiesByRegionRows.filter((activity) => {
            return (
              activity.mondayActivities.length > 0 ||
              activity.tuesdayActivities.length > 0 ||
              activity.wednesdayActivities.length > 0 ||
              activity.thursdayActivities.length > 0 ||
              activity.fridayActivities.length > 0
            );
          });
        }
      });
  }

}
