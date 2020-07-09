import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ExecutiveEmployee } from 'app/main/activity/models/executiveEmployee';
import { ActivityService } from '../../activity.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'activity-employees-counters',
  templateUrl: './activity-employees-counters.component.html',
  styleUrls: ['./activity-employees-counters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivityEmployeesCountersComponent implements OnInit {
  executiveEmployees: ExecutiveEmployee[];
  years: number[];
  year: number;

  displayedColumns = ['fullName', 'presenceCounter', 'holidaysCounter'];

  constructor(
    private _activityService: ActivityService) { }

  ngOnInit(): void {
    this._activityService.onYearsChanged.subscribe((years) => {
      this.years = years;
    });
  }

  getExecutiveEmployeeCounters(form: NgForm): void {
    if (form.valid) {

      this._activityService.getExecutiveEmployeeCounters(this.year)
        .subscribe((executiveEmployees) => {
          this.executiveEmployees = executiveEmployees;
        }, (err) => {
          console.log(err);
        });
    }
  }

}

