import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { ActivityAbsenceService } from '../activity-absence.service';
import { Department } from 'app/common/models/department';
import { AbsencesMainViewModel } from 'app/main/activity/models/absencesMainViewModel';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'activity-absence-sidebar',
  templateUrl: './activity-absence-sidebar.component.html',
  styleUrls: ['./activity-absence-sidebar.component.scss']
})
export class ActivityAbsenceSidebarComponent implements OnInit, OnDestroy {
  departments: Department[];
  filtredDepartments: Department[];
  absencesMainViewModel: AbsencesMainViewModel;

  private unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _activityAbsenceService: ActivityAbsenceService,
    private _loaderService: NgxUiLoaderService
  ) {
    this.unsubscribeAll = new Subject();
    this.absencesMainViewModel = new AbsencesMainViewModel();
  }

  ngOnInit(): void {
    this._activityAbsenceService.onAbsencesMainViewModel
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((absencesMainViewModel) => {
        this.absencesMainViewModel = absencesMainViewModel;
        this.departments = absencesMainViewModel.departments;
        this.filtredDepartments = absencesMainViewModel.departments;
      });
    this._activityAbsenceService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  getAbsencesByDepartementForDate(): void {
    this._loaderService.start();
    this._activityAbsenceService.getAbsencesByDepartementForDate(this.absencesMainViewModel)
      .pipe(take(1))
      .subscribe((absences) => {
        this._activityAbsenceService.onAbsencesChanged.next(absences);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  searchDepartment(searchInput): void {
    if (!this.departments) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredDepartments = this.departments.filter(d => d.name.toLowerCase().indexOf(searchInput) > -1);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}



