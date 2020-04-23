import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { AdditiveProvider } from 'app/main/technical-sheet/models/additiveProvider';
import { TechnicalSheetService } from 'app/main/technical-sheet/technical-sheet.service';

@Component({
  selector: 'app-add-provider-dialog',
  templateUrl: './add-provider-dialog.component.html',
  styleUrls: ['./add-provider-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProviderDialogComponent implements OnInit {
  providers: AdditiveProvider[];
  provider: AdditiveProvider;

  constructor(
    public matDialogRef: MatDialogRef<AddProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private technicalSheetService: TechnicalSheetService,
    private _notificationService: SharedNotificationService
  ) {
    if (data.mode === 'edit') {
      this.provider = data.provider;
    } else {
      this.provider = new AdditiveProvider();
    }

  }

  ngOnInit(): void {
    this.technicalSheetService.onProvidersChanged.subscribe((providers) => {
      this.providers = providers;
    });
  }

  addProvider(): void {
    this._loaderService.start();
    this.technicalSheetService.addProvider(this.provider)
      .subscribe((createdProviderId) => {
        this._loaderService.stop();
        this.matDialogRef.close();
        this.provider.id = createdProviderId;
        this.provider.canDelete = true;
        this.providers.push(this.provider);
        this.technicalSheetService.onProvidersChanged.next(JSON.parse(JSON.stringify(this.providers)));
        this._notificationService.showSuccess('Ajout terminé avec succès');
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  updateProvider(): void {
    this._loaderService.start();
    this.technicalSheetService.updateProvider(this.provider)
      .subscribe((response) => {
        if (response) {
          this._loaderService.stop();
          this.matDialogRef.close();
          this._notificationService.showSuccess('Modification terminé avec succès');
          const foundIndex = this.providers.findIndex(x => x.id === this.provider.id);
          this.providers[foundIndex] = this.provider;
          this.technicalSheetService.onProvidersChanged.next(JSON.parse(JSON.stringify(this.providers)));
        } else {
          this._notificationService.showStandarError();
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
        this.updateProvider();
      } else {
        this.addProvider();
      }
    }
  }

}




