import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CommonService } from 'app/common/services/common.service';
import { TechnicalSheetService } from './technical-sheet.service';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { takeUntil } from 'rxjs/operators';
import { Habilitation } from '../access-rights/models/habilitation';
import { Subject } from 'rxjs';
import { AppService } from 'app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTechnicalSheetDialogComponent } from './dilaogs/add-technical-sheet-dialog/add-technical-sheet-dialog.component';

@Component({
  selector: 'technical-sheet',
  templateUrl: './technical-sheet.component.html',
  styleUrls: ['./technical-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TechnicalSheetComponent implements OnInit, OnDestroy {
  currentTechnicalSheet: TechnicalSheet;
  habilitation: Habilitation = new Habilitation(0);
  private dialogRef: any;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  technicalSheets: TechnicalSheet[] = [];

  constructor(
    public commonService: CommonService,
    private _technicalSheetService: TechnicalSheetService,
    private _matDialog: MatDialog,
    private appService: AppService) { }

  ngOnInit(): void {
    this._technicalSheetService.onTechnicalSheetsChanged
      .subscribe(technicalSheets => {
        this.technicalSheets = technicalSheets;
      });
    this._technicalSheetService.onCurrentTechnicalSheetChanged
      .subscribe(currentTechnicalSheet => {
        if (!currentTechnicalSheet) {
          this.currentTechnicalSheet = null;
        }
        else {
          this.currentTechnicalSheet = currentTechnicalSheet;
        }
      });

    this._technicalSheetService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
        if (this.habilitation.isSuperAdmin()) {
          this.appService.onShowConfigButtonChanged.next(true);
          this.appService.onConfigurationUrlChanged.next('/technicalSheet-configuration');
        }
      });
  }

  addTechnicalSheet(): void {
    this.dialogRef = this._matDialog.open(AddTechnicalSheetDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.success) {
            this.technicalSheets.push(response.data);
            this._technicalSheetService.onTechnicalSheetsChanged.next(this.technicalSheets);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
    this.appService.setConfigButtonParameters(false, null);
  }

}


