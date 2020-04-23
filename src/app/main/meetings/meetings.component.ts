import { Component, OnInit } from '@angular/core';
import { MeetingsService } from './meetings.service';
import { MeetInstance } from 'app/main/meetings/models/meetInstance';
import { MeetingtPole } from 'app/main/meetings/models/meetingPole';
import { MeetingSector } from 'app/main/meetings/models/meetingSector';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CodirComment } from 'app/main/meetings/models/codirComment';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { AddDecisionDialogComponent } from './dilaogs/add-decision-dialog/add-decision-dialog.component';
import { GenerateTaskDialogComponent } from './dilaogs/generate-task-dialog/generate-task-dialog.component';
import { CommonService } from 'app/common/services/common.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
  animations: fuseAnimations
})
export class MeetingsComponent implements OnInit {
  poles: MeetingtPole[];
  weekNumber: number;
  date: string;
  currentInstance: MeetInstance;
  currentPole: MeetingtPole;
  currentSector: MeetingSector;
  commentContent: string;
  selectedTab: number;
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _meetingsService: MeetingsService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private _matDialog: MatDialog,
    public commonService: CommonService) {
  }

  ngOnInit(): void {
    this._meetingsService.meetingsViewModel.subscribe((meetingsViewModel) => {
      this.weekNumber = meetingsViewModel.weekNumber;
      this.date = meetingsViewModel.codirDate;
      this.currentInstance = meetingsViewModel.currentInstance;
      this.poles = meetingsViewModel.poles;
    });
    this._meetingsService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addComment(point: CodirComment, pointIndex: number): void {
    if (this.commentContent !== '' && this.commentContent.length > 3) {
      this._loaderService.start();
      const commentToSend: CodirComment = {
        simpleTaskItemId: point.simpleTaskItemId,
        content: this.commentContent,
        isSimpleComment: true
      };
      this._meetingsService.addComment(commentToSend)
        .subscribe((addedComment) => {
          this._loaderService.stop();
          this.updateComments(addedComment, pointIndex);
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  changeSelectedPole(pole?: MeetingtPole, sector?: MeetingSector): void {
    if (pole && sector) {
      this.currentPole = pole;
      this.currentSector = sector;
    } else {
      this.currentPole = null;
      this.currentSector = null;
    }
  }

  updateComments(newComment: CodirComment, pointIndex: number): void {
    const poleIndex = this.poles.findIndex(p => p.id === this.currentPole.id);
    const sectorIndex = this.poles[poleIndex].sectors.findIndex(s => s.id === this.currentSector.id);
    this.poles[poleIndex].sectors[sectorIndex].codirComments[pointIndex].comments.push(newComment);
    this.commentContent = '';
  }

  addDecision(simpleTaskItemId: number): void {
    this.dialogRef = this._matDialog.open(AddDecisionDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        pointId: simpleTaskItemId,
        instanceId: this.currentInstance.id
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  generateTask(point: CodirComment, pointIndex: number): void {
    this.dialogRef = this._matDialog.open(GenerateTaskDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        simpleTaskItemId: point.simpleTaskItem.id,
        point: point.simpleTaskItem
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response.success) {
          const poleIndex = this.poles.findIndex(p => p.id === this.currentPole.id);
          const sectorIndex = this.poles[poleIndex].sectors.findIndex(s => s.id === this.currentSector.id);
          this.poles[poleIndex].sectors[sectorIndex].codirComments.splice(pointIndex, 1);
          this.poles[poleIndex].sectors[sectorIndex].taskItemsCount = this.poles[poleIndex].sectors[sectorIndex].taskItemsCount - 1;
          if (point.isLastWeeksComment) {
            this.poles[poleIndex].sectors[sectorIndex].lastWeeksTaskItemsCount = this.poles[poleIndex].sectors[sectorIndex].lastWeeksTaskItemsCount - 1;
          }
        }
      });
  }

  closeItem(point: CodirComment, pointIndex: number): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Clôturer point',
        message: 'Cela signifie la clôture définitive de ce point à traiter, confirmez-vous cette opération de clôture ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._meetingsService.closeItem(point.simpleTaskItem)
            .subscribe((result) => {
              this._loaderService.stop();
              const poleIndex = this.poles.findIndex(p => p.id === this.currentPole.id);
              const sectorIndex = this.poles[poleIndex].sectors.findIndex(s => s.id === this.currentSector.id);
              this.poles[poleIndex].sectors[sectorIndex].codirComments.splice(pointIndex, 1);
              this.poles[poleIndex].sectors[sectorIndex].taskItemsCount = this.poles[poleIndex].sectors[sectorIndex].taskItemsCount - 1;
              if (point.isLastWeeksComment) {
                this.poles[poleIndex].sectors[sectorIndex].lastWeeksTaskItemsCount = this.poles[poleIndex].sectors[sectorIndex].lastWeeksTaskItemsCount - 1;
              }
            }, (err) => {
              this._loaderService.stop();
              this._notificationService.showStandarError();
              console.log(err);
            });
        }
      });
  }

  onTabChange(tab: any): void {
    this.selectedTab = tab.index;
  }

}
