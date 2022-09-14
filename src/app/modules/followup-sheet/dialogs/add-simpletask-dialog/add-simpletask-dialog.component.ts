import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FollowupSheetService } from '../../followup-sheet.service';
import { Folder } from '../../models/folder';
import { RequestParameter } from '../../models/requestParameter';
import { Section } from '../../models/section';

@Component({
  selector: 'app-add-simpletask-dialog',
  templateUrl: './add-simpletask-dialog.component.html'
})
export class AddSimpletaskDialogComponent implements OnInit {
  currentSection: Section;
  folder: Folder;

  constructor(
    public matDialogRef: MatDialogRef<AddSimpletaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    const requestParameter: RequestParameter = {
      section: this.currentSection,
      folder: this.folder
    };
    this._followupSheetService.addSimpleTask(requestParameter)
      .subscribe((createdFolder) => {
        this.matDialogRef.close({ success: true, folder: createdFolder });
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  renameSimpleTask(): void {
    this._followupSheetService.renameSimpleTask(this.folder)
      .subscribe((response) => {
        if (response) {
          this.matDialogRef.close({ success: true, title: this.folder.title });
        }
      }, (err) => {
        console.log(err);
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


