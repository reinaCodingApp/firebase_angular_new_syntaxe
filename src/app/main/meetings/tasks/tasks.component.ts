import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MeetingsService } from '../meetings.service';
import { SmallSheet } from 'app/main/followup-sheet/models/smallSheet';
import { MeetingSector } from 'app/main/meetings/models/meetingSector';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FilterParameter } from 'app/main/meetings/models/filterParameter';
import { MeetInstance } from 'app/main/meetings/models/meetInstance';
import { GeneratedTask } from 'app/main/meetings/models/generatedTask';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { RequestParameter } from 'app/main/meetings/models/requestParameter';
import { GeneratedTaskComment } from 'app/main/meetings/models/generatedTaskComment';
import { ReaffectTaskDialogComponent } from '../dilaogs/reaffect-task-dialog/reaffect-task-dialog.component';
import { CommonService } from 'app/common/services/common.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'meetings-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class TasksComponent implements OnInit {
  currentInstance: MeetInstance;
  latestWeeks: SmallSheet[];
  currentWeek: SmallSheet;
  sectors: MeetingSector[];
  currentSector: MeetingSector;
  filterParameter: FilterParameter;
  filterInput: string = null;
  includeClosedTasks = false;
  tasks: GeneratedTask[] = [];
  commentContent: string;
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _meetingsService: MeetingsService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private _matDialog: MatDialog,
    public commonService: CommonService
  ) {
    this.filterParameter = new FilterParameter();
  }

  ngOnInit(): void {
    this._meetingsService.meetingsViewModel.subscribe((meetingsViewModel) => {
      this.latestWeeks = meetingsViewModel.latestWeeks;
      this.sectors = meetingsViewModel.sectors;
      this.currentInstance = meetingsViewModel.currentInstance;
    });
    this._meetingsService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  findGeneratedTasks(): void {
    this._loaderService.start();
    this.filterParameter = {
      filter: this.filterInput === '' ? null : this.filterInput,
      sheet: this.currentWeek,
      sector: this.currentSector,
      includeClosedTasks: this.includeClosedTasks,
      currentInstance: this.currentInstance
    };
    this._meetingsService.findGeneratedTasks(this.filterParameter)
      .subscribe((tasks) => {
        this._loaderService.stop();
        this.tasks = tasks;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  displayClosedGeneratedTasks(): void {
    this._loaderService.start();
    this._meetingsService.displayClosedGeneratedTasks(this.currentInstance)
      .subscribe((tasks) => {
        this._loaderService.stop();
        this.tasks = tasks;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  displayNotClosedGeneratedTasks(): void {
    this._loaderService.start();
    this._meetingsService.displayNotClosedGeneratedTasks(this.currentInstance)
      .subscribe((tasks) => {
        this._loaderService.stop();
        this.tasks = tasks;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  getOutdatedTasks(): void {
    this._loaderService.start();
    this._meetingsService.getOutdatedTasks(this.currentInstance)
      .subscribe((tasks) => {
        this._loaderService.stop();
        this.tasks = tasks;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  getRecentlyOutdatedTasks(): void {
    this._loaderService.start();
    this._meetingsService.getRecentlyOutdatedTasks(this.currentInstance)
      .subscribe((tasks) => {
        this._loaderService.stop();
        this.tasks = tasks;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  addGeneratedTaskComment(task: GeneratedTask, taskIndex: number): void {
    if (this.commentContent !== '' && this.commentContent.length > 3) {
      this._loaderService.start();
      const comment = new GeneratedTaskComment();
      comment.content = this.commentContent;
      const requestParameter: RequestParameter = {
        comment: comment,
        task: task
      };
      this._meetingsService.addGeneratedTaskComment(requestParameter)
        .subscribe((addedComment) => {
          this._loaderService.stop();
          this.tasks[taskIndex].comments.push(addedComment);
          this.commentContent = '';
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  closeGeneratedTask(task: GeneratedTask, taskIndex: number): void {
    if (this.habilitation.isAdmin() && !task.isClosed) {
      this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
        panelClass: 'confirm-dialog',
        data: {
          title: 'Clôturer tâche',
          message: 'Êtes-vous sûr de vouloir définitivement clôturer cette tâche ?'
        }
      });
      this.dialogRef.afterClosed()
        .subscribe(response => {
          if (response) {
            this._loaderService.start();
            this._meetingsService.closeGeneratedTask(task)
              .subscribe((result) => {
                this._loaderService.stop();
                if (result && this.includeClosedTasks) {
                  this.tasks[taskIndex].isClosed = true;
                } else {
                  this.tasks.splice(taskIndex, 1);
                }
              }, (err) => {
                this._loaderService.stop();
                this._notificationService.showStandarError();
                console.log(err);
              });
          }
        });
    }
  }

  reaffectGeneratedTask(task: GeneratedTask, taskIndex: number): void {
    this.dialogRef = this._matDialog.open(ReaffectTaskDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        task: task,
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.success && response.data.type === 'reaffect') {
            this.tasks[taskIndex].employeeDestinationId = response.data.employee.id;
            this.tasks[taskIndex].employeeName = response.data.employee.employee.fullName;
          } else if (response.success && response.data.type === 'deadline') {
            this.tasks[taskIndex].endDate = response.data.endDate;
          } else {
            this.tasks.splice(taskIndex, 1);
          }
        }
      });
  }

}

