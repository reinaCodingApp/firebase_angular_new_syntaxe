import { MainTools } from 'app/common/tools/main-tools';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TraceabilityService } from '../traceability.service';
import { CommonService } from 'app/common/services/common.service';
import { RequestParameter } from 'app/main/traceability/models/descending/requestParameter';
import { MatDialog } from '@angular/material';
import { TraceabilityPlanification } from 'app/main/traceability/models/descending/traceabilityPlanification';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { PrintWeeksDialogComponent } from '../dialogs/print-weeks-dialog/print-weeks-dialog.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { TraceabiliyCodesOfweekComponent } from '../dialogs/traceabiliy-codes-ofweek/traceabiliy-codes-ofweek.component';

@Component({
  selector: 'traceability-sidebar',
  templateUrl: './traceability-sidebar.component.html',
  styleUrls: ['./traceability-sidebar.component.scss']
})
export class TraceabilitySidebarComponent implements OnInit {
  traceabilityPlanification: TraceabilityPlanification;
  requestParameter: RequestParameter;
  weeks: number[];
  years: number[];
  colors: string[];
  selectedColor = 'Non définie';
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _traceabilityService: TraceabilityService,
    private _notificationService: SharedNotificationService,
    private _matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.weeks = EmbeddedDatabase.weeks;
    this._traceabilityService.onYearsChanged.subscribe((years) => {
      this.years = years;
    });
    this._traceabilityService.onColorsChanged.subscribe((colors) => {
      this.colors = colors;
    });
    this._traceabilityService.onRequestParameterChanged.subscribe((requestParameter) => {
      this.requestParameter = requestParameter;
    });
    this._traceabilityService.onTaceabilityPlanificationChanged.subscribe((traceabilityPlanification) => {
      this.traceabilityPlanification = traceabilityPlanification;
      this.selectedColor = 'Non définie';
    });
    this._traceabilityService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getTraceabilityPlanification(): void {

    this._traceabilityService.getTraceabilityPlanification(this.requestParameter)
      .subscribe((traceabilityPlanification) => {
        this._traceabilityService.onRequestParameterChanged.next(this.requestParameter);
        this.traceabilityPlanification = traceabilityPlanification;
        this._traceabilityService.onTaceabilityPlanificationChanged.next(traceabilityPlanification);
      }, (err) => {
        console.log(err);
      });
  }
  updateOrAddPlanification(): void {
    if (this.traceabilityPlanification) {
      this.selectedColor = this.traceabilityPlanification.color;
    }
    if (this.selectedColor !== 'Non définie') {
      this.requestParameter.color = this.selectedColor;
      this._traceabilityService.updateOrAddPlanification(this.requestParameter)
        .subscribe((traceabilityPlanification) => {
          let updatedTraceabilityPlanification = null;
          if (this.traceabilityPlanification != null) {
            this.traceabilityPlanification.color = traceabilityPlanification.color;
            this.traceabilityPlanification.mel = traceabilityPlanification.mel;
            updatedTraceabilityPlanification = JSON.parse(JSON.stringify(this.traceabilityPlanification));
          } else {
            if (traceabilityPlanification.items == null) {
              traceabilityPlanification.items = [];
            }
            updatedTraceabilityPlanification = traceabilityPlanification;
          }
          this._traceabilityService.onTaceabilityPlanificationChanged.next(updatedTraceabilityPlanification);
        }, (err) => {
          console.log(err);
        });
    } else {
      this._notificationService.showWarning('Veuillez choisir une couleur !');
    }
  }

  changeSelectedColor(color: string): void {
    this.selectedColor = color;
    if (this.traceabilityPlanification) {
      this.traceabilityPlanification.color = color;
    }
  }

  getColor(color: string): string {
    let currentColor: string;
    switch (color) {
      case 'Rouge':
        currentColor = '#EF4B4A';
        break;
      case 'Bleu':
        currentColor = 'blue';
        break;
      case 'Noir':
        currentColor = '#000000';
        break;
      case 'Vert':
        currentColor = '#91DC5B';
        break;
      case 'Jaune':
        currentColor = 'yellow';
        break;
      case 'Orange':
        currentColor = '#F79B08';
        break;
    }
    return currentColor;
  }

  printSites(): void {
    MainTools.printFromHtml('printSitesContent');
  }

  printWeeks(): void {
    this.dialogRef = this._matDialog.open(PrintWeeksDialogComponent, {
      panelClass: 'mail-compose-dialog',
    });
  }

  managTraceabilityCodesOfWeek(): void{
    this.dialogRef = this._matDialog.open(TraceabiliyCodesOfweekComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        traceabilityPlanification: this.traceabilityPlanification,
      }
    });
  }

}




