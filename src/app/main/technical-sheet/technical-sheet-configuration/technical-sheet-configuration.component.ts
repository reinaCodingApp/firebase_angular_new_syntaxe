
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { AdditiveProvider } from '../models/additiveProvider';
import { AddEmployeelevelDialogComponent } from 'app/main/followup-sheet/followup-sheet-configuration/dialogs/add-employeelevel-dialog/add-employeelevel-dialog.component';
import { TechnicalSheetService } from '../technical-sheet.service';
import { AddProviderDialogComponent } from './dialogs/add-provider-dialog/add-provider-dialog.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-technical-sheet-configuration',
  templateUrl: './technical-sheet-configuration.component.html',
  styleUrls: ['./technical-sheet-configuration.component.scss'],
  animations: fuseAnimations
})
export class TechnicalSheetConfigurationComponent implements OnInit, OnDestroy {

  providers: AdditiveProvider[] = [];
  displayColumns = ['name', 'city', 'adress', 'country', 'actions'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private technicalSheetService: TechnicalSheetService,
    private matDialog: MatDialog,
    private loaderService: NgxUiLoaderService,
    private notificationService: SharedNotificationService) {
  }
  ngOnInit(): void {
    this.technicalSheetService.onProvidersChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(providers => {
        this.providers = [...providers];
      });
    this.technicalSheetService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  addProvider(): void {
    this.dialogRef = this.matDialog.open(AddProviderDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  updateProvider(currentProvider: EmployeeLevel): void {
    const provider = JSON.parse(JSON.stringify(currentProvider));
    this.dialogRef = this.matDialog.open(AddProviderDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        provider: provider
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }


  deleteProvider(provider: AdditiveProvider): void {
    this.dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Supprimer Fournisseur',
        message: 'Confirmez-vous la suppression de ce fournisseur ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.loaderService.start();
          this.technicalSheetService.deleteProvider(provider.id)
            .subscribe((result) => {
              this.loaderService.stop();
              if (result) {
                const foundIndex = this.providers.findIndex(p => p.id === provider.id);
                this.providers.splice(foundIndex, 1);
                this.technicalSheetService.onProvidersChanged.next(JSON.parse(JSON.stringify(this.providers)));
              } else {
                this.notificationService.showStandarError();
              }
            }, (err) => {
              this.loaderService.stop();
              this.notificationService.showStandarError();
              console.log(err);
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}


