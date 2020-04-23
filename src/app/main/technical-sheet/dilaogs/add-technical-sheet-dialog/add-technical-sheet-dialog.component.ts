import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { TechnicalSheetService } from '../../technical-sheet.service';
import { Site } from 'app/common/models/site';
import { AdditiveProvider } from 'app/main/technical-sheet/models/additiveProvider';

@Component({
  selector: 'app-add-technical-sheet-dialog',
  templateUrl: './add-technical-sheet-dialog.component.html',
  styleUrls: ['./add-technical-sheet-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTechnicalSheetDialogComponent implements OnInit {
  technicalSheet: TechnicalSheet;
  sites: Site[];
  providers: AdditiveProvider[];

  constructor(
    public matDialogRef: MatDialogRef<AddTechnicalSheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _technicalSheetService: TechnicalSheetService,
    private _notificationService: SharedNotificationService
  ) {
    this.technicalSheet = new TechnicalSheet();
  }

  ngOnInit(): void {
    this._technicalSheetService.onSitesChanged.subscribe((sites) => {
      this.sites = sites.filter(s => s.id !== 0);
    });
    this._technicalSheetService.onProvidersChanged.subscribe((providers) => {
      this.providers = providers;
    });
  }

  addTechnicalSheet(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this._technicalSheetService.addTechnicalSheet(this.technicalSheet)
        .subscribe((addedTechnicalSheet) => {
          this._loaderService.stop();
          this.matDialogRef.close({ success: true, data: addedTechnicalSheet });
          this._notificationService.showSuccess('Fiche technique crée avec succés');
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

}

