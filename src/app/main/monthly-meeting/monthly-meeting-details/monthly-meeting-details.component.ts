import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { MonthlyMeetingService } from '../monthly-meeting.service';
import { MonthlyMeeting } from '../models/monthlyMeeting';
import { AddPresenceDialogComponent } from './dialogs/add-presence-dialog/add-presence-dialog.component';
import { MonthlyMeetingPresence } from '../models/monthlyMeetingPresence';


@Component({
  selector: 'app-monthly-meeting-details',
  templateUrl: './monthly-meeting-details.component.html',
  styleUrls: ['./monthly-meeting-details.component.scss'],
  animations: fuseAnimations
})
export class MonthlyMeetingDetailsComponent implements OnInit, OnDestroy {

  monthlyMeeting: MonthlyMeeting;
  displayColumns = ['employee', 'startTimeStr', 'endTimeStr', 'defaultDepartment', 'startDateStr', 'endDateStr', 'observations', 'actions'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private monthlyMeetingService: MonthlyMeetingService,
    private matDialog: MatDialog) {
  }
  ngOnInit(): void {
    this.monthlyMeetingService.currentMonthlyMeetingChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(monthlyMeeting => {
        this.monthlyMeeting = monthlyMeeting;
      });
    this.monthlyMeetingService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitation => {
        this.habilitation = habilitation;
      });
  }

  addMonthlyMeetingPresence(): void {
    this.dialogRef = this.matDialog.open(AddPresenceDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
        monthlyMeeting: this.monthlyMeeting
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  updateMonthlyMeetingPresence(currentPresence: MonthlyMeetingPresence): void {
    const monthlyMeetingPresence = JSON.parse(JSON.stringify(currentPresence));
    this.dialogRef = this.matDialog.open(AddPresenceDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        monthlyMeeting: this.monthlyMeeting,
        monthlyMeetingPresence: monthlyMeetingPresence
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}


