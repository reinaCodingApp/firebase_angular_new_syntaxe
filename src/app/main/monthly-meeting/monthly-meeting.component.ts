import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { MonthlyMeeting } from './models/monthlyMeeting';
import { MonthlyMeetingService } from './monthly-meeting.service';
import { AddMonthlyMeetingDialogComponent } from './dialogs/add-monthly-meeting-dialog/add-monthly-meeting-dialog.component';


@Component({
  selector: 'app-monthly-meeting',
  templateUrl: './monthly-meeting.component.html',
  styleUrls: ['./monthly-meeting.component.scss'],
  animations: fuseAnimations
})
export class MonthlyMeetingComponent implements OnInit, OnDestroy {

  monthlyMeetings: MonthlyMeeting[] = [];
  displayColumns = ['date', 'title', 'description', 'actions'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private monthlyMeetingService: MonthlyMeetingService,
    private matDialog: MatDialog) {
  }
  ngOnInit(): void {
    this.monthlyMeetingService.onMonthlyMeetingsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(monthlyMeetings => {
        this.monthlyMeetings = [...monthlyMeetings];
      });
    this.monthlyMeetingService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitation => {
        this.habilitation = habilitation;
      });
  }

  addMonthlyMeeting(): void {
    this.dialogRef = this.matDialog.open(AddMonthlyMeetingDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  updateMonthlyMeeting(currentMonthlyMeeting: MonthlyMeeting): void {
    const monthlyMeeting = JSON.parse(JSON.stringify(currentMonthlyMeeting));
    this.dialogRef = this.matDialog.open(AddMonthlyMeetingDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        monthlyMeeting: monthlyMeeting
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


