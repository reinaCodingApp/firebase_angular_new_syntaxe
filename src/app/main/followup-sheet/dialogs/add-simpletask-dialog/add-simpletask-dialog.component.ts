import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FollowupSheetService } from '../../followup-sheet.service';
import { Folder } from 'app/main/followup-sheet/models/folder';
import { Section } from 'app/main/followup-sheet/models/section';
import { RequestParameter } from 'app/main/followup-sheet/models/requestParameter';

@Component({
  selector: 'app-add-simpletask-dialog',
  templateUrl: './add-simpletask-dialog.component.html',
  styleUrls: ['./add-simpletask-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSimpletaskDialogComponent implements OnInit {
  currentSection: Section;
  folder: Folder;

  constructor(
    public matDialogRef: MatDialogRef<AddSimpletaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _followupSheetService: FollowupSheetService,
    private _notificationService: SharedNotificationService
  ) {
    if (data.mode === 'edit') {
      this.folder = data.folder;
    } else {
      this.currentSection = data.currentSection;
      this.folder = new Folder();
    }

  }

  ngOnInit(): void {
  }

  addSimpleTask(): void {
    this._loaderService.start();
    const requestParameter: RequestParameter = {
      section: this.currentSection,
      folder: this.folder
    };
    this._followupSheetService.addSimpleTask(requestParameter)
      .subscribe((createdFolder) => {
        this.matDialogRef.close({ success: true, folder: createdFolder });
        this._loaderService.stop();
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  renameSimpleTask(): void {
    this._loaderService.start();
    this._followupSheetService.renameSimpleTask(this.folder)
      .subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          this.matDialogRef.close({ success: true, title: this.folder.title });
        }
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.renameSimpleTask();
      } else {
        this.addSimpleTask();
      }
    }
  }

}


