import { MainTools } from 'app/common/tools/main-tools';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TraceabilityService } from '../traceability.service';
import { AddTraceabilityDialogComponent } from '../dialogs/add-traceability-dialog/add-traceability-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AddExceptioncodeDialogComponent } from '../dialogs/add-exceptioncode-dialog/add-exceptioncode-dialog.component';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { TraceabilityPlanification } from '../models/descending/traceabilityPlanification';
import { RequestParameter } from '../models/descending/requestParameter';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { Traceability } from '../models/descending/traceability';
import { TraceabilityComponent } from '../traceability.component';

@Component({
  selector: 'traceability-content',
  templateUrl: './traceability-content.component.html'
})
export class TraceabilityContentComponent implements OnInit {
  traceabilityPlanification: TraceabilityPlanification;
  requestParameter: RequestParameter;
  displayedColumns = ['site', 'stamp', 'ring', 'color', 'description', 'actions'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _traceabilityService: TraceabilityService,
    public traceabilityComponent: TraceabilityComponent,
    private _matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this._traceabilityService.onTaceabilityPlanificationChanged
      .subscribe((traceabilityPlanification) => {
        this.traceabilityPlanification = traceabilityPlanification;
      });
    this._traceabilityService.onRequestParameterChanged.subscribe((requestParameter) => {
      this.requestParameter = requestParameter;
    });
    this._traceabilityService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  updateTraceability(traceability: Traceability): void {
    const updateTraceability = JSON.parse(JSON.stringify(traceability));
    this.dialogRef = this._matDialog.open(AddTraceabilityDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        traceabilityPlanification: this.traceabilityPlanification,
        traceability: updateTraceability
      }
    });
  }
  addTraceability(): void {
    this.dialogRef = this._matDialog.open(AddTraceabilityDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
        traceabilityPlanification: this.traceabilityPlanification
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  addExceptionCode(traceability: Traceability): void {
    const updateTraceability = JSON.parse(JSON.stringify(traceability));
    this.dialogRef = this._matDialog.open(AddExceptioncodeDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        traceability: updateTraceability,
        traceabilityPlanification: this.traceabilityPlanification
      }
    });
  }

  getDateforCurrentYearAndWeek(): string {
    return moment().year(this.requestParameter.year)
      .week(this.requestParameter.week)
      .day('lundi').format('dddd DD/MM/YYYY');
  }

  changeWeekNumber(stepNumber: number): void {
    this.requestParameter.week = this.requestParameter.week + stepNumber;
    this._traceabilityService.getTraceabilityPlanification(this.requestParameter)
      .subscribe((traceabilityPlanification) => {
        this._traceabilityService.onRequestParameterChanged.next(this.requestParameter);
        this.traceabilityPlanification = traceabilityPlanification;
        this._traceabilityService.onTaceabilityPlanificationChanged.next(traceabilityPlanification);
        }, (err) => {
        console.log(err);
      });
  }

  deleteTraceability(traceability: Traceability): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression ligne Traçabilité',
        message: 'Voulez-vous définitivement supprimer cette ligne de traçabilité ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._traceabilityService.deleteTraceability(traceability.id)
            .subscribe((result) => {
              if (result) {
                const index = this.traceabilityPlanification.items.findIndex(item => item.id === traceability.id);
                if (index >= 0) {
                  this.traceabilityPlanification.items.splice(index, 1);
                  this._traceabilityService.onTaceabilityPlanificationChanged.next(JSON.parse(JSON.stringify(this.traceabilityPlanification)));
                }
              }
            }, (err) => {
              console.log(err);
            });
        }
      });
  }
  printTraceabilitySites(): void {
    MainTools.printFromHtml('printSitesContent');
  }

}
