import { MainTools } from 'app/common/tools/main-tools';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TechnicalSheetService } from '../technical-sheet.service';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { fuseAnimations } from '@fuse/animations';
import { CommonService } from 'app/common/services/common.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'technical-sheet-details',
  templateUrl: './technical-sheet-details.component.html',
  styleUrls: ['./technical-sheet-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TechnicalSheetDetailsComponent implements OnInit {
  technicalSheet: TechnicalSheet;
  qrserverApi = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=';
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _technicalSheetService: TechnicalSheetService,
    private _commonService: CommonService) { }

  ngOnInit(): void {
    this._technicalSheetService.onCurrentTechnicalSheetChanged
      .subscribe(technicalSheet => {
        this.technicalSheet = technicalSheet;
      });
    this._technicalSheetService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  updateTechnicalSheet(): void {
    if (this.habilitation.canEdit()) {
      this._technicalSheetService.updateTechnicalSheet(this.technicalSheet)
        .subscribe(() => {
          this._technicalSheetService.onCurrentTechnicalSheetChanged.next(this.technicalSheet);
        });
    }
  }

  uploadAttachment(files): void {
    if (files.length === 0) {
      return;
    }
    const attachmentToUpload = files[0];
    this._technicalSheetService.uploadAttachment(attachmentToUpload, this.technicalSheet.id)
      .subscribe((attachment) => {
        this.technicalSheet.attachment = attachment;
        this._technicalSheetService.onCurrentTechnicalSheetChanged.next(this.technicalSheet);
      });
  }

  downloadAttachment(): void {
    this._technicalSheetService.downloadAttachment(this.technicalSheet.attachment)
      .subscribe(data => {
        MainTools.downloadAttachment(this.technicalSheet.attachment, data);
      });
  }

  removeAttachment(): void {
    this._technicalSheetService.removeAttachment(this.technicalSheet)
      .subscribe((response) => {
        if (response) {
          this.technicalSheet.attachment = null;
          this._technicalSheetService.onCurrentTechnicalSheetChanged.next(this.technicalSheet);
        }
      });
  }

}
