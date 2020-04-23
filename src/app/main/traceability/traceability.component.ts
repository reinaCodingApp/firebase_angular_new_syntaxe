import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { AddTraceabilityDialogComponent } from './dialogs/add-traceability-dialog/add-traceability-dialog.component';
import { TraceabilityPlanification } from './models/descending/traceabilityPlanification';
import { TraceabilityService } from './traceability.service';
import { Habilitation } from '../access-rights/models/habilitation';

@Component({
  selector: 'app-traceability',
  templateUrl: './traceability.component.html',
  styleUrls: ['./traceability.component.scss'],
  animations: fuseAnimations
})
export class TraceabilityComponent implements OnInit {

  dialogRef: any;
  traceabilityPlanification: TraceabilityPlanification;
  habilitation: Habilitation = new Habilitation(0);

  constructor(public commonService: CommonService,
              private matDialog: MatDialog,
              private traceabilityService: TraceabilityService) { }

  ngOnInit() {
    this.traceabilityService.onTaceabilityPlanificationChanged.subscribe(response => {
      this.traceabilityPlanification = response;
    });
    this.traceabilityService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }
  popupAddTraceability(): void {
    this.dialogRef = this.matDialog.open(AddTraceabilityDialogComponent, {
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
}
