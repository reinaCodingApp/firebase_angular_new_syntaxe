import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MeetingsService } from '../../meetings.service';
import { Decision } from 'app/main/meetings/models/decision';
import { MeetingSector } from 'app/main/meetings/models/meetingSector';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-decision-dialog',
  templateUrl: './add-decision-dialog.component.html',
  styleUrls: ['./add-decision-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddDecisionDialogComponent implements OnInit {
  decision: Decision;
  sectors: MeetingSector[];

  constructor(
    public matDialogRef: MatDialogRef<AddDecisionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private _meetingsService: MeetingsService
  ) {
    this.decision = new Decision();
    this.decision.instanceId = data.instanceId;
    this.decision.pointId = data.pointId;
  }

  ngOnInit(): void {
    this._meetingsService.onSectorsChanged.subscribe((sectors) => {
      this.sectors = sectors;
    });
  }

  addDecision(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this._meetingsService.addDecision(this.decision)
        .subscribe((createdDecision) => {
          this._loaderService.stop();
          this.matDialogRef.close();
          this._notificationService.showSuccess('Décision crée crée avec succés');
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }

  }

}


