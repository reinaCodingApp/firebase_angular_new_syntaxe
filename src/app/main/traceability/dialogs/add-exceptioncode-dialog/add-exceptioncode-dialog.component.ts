import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { TraceabilityService } from '../../traceability.service';
import { Traceability } from 'app/main/traceability/models/descending/traceability';
import { TraceabilityMaterial } from 'app/main/traceability/models/traceabilityMaterial';
import { NgForm } from '@angular/forms';
import { ExceptionalCode } from 'app/main/traceability/models/descending/exceptionalCode';
import { TraceabilityPlanification } from 'app/main/traceability/models/descending/traceabilityPlanification';

@Component({
  selector: 'app-add-exceptioncode-dialog',
  templateUrl: './add-exceptioncode-dialog.component.html',
  styleUrls: ['./add-exceptioncode-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddExceptioncodeDialogComponent implements OnInit {
  traceabilityPlanification: TraceabilityPlanification;
  traceability: Traceability;
  shapes: TraceabilityMaterial[];
  exceptionalCode: ExceptionalCode;

  constructor(
    public matDialogRef: MatDialogRef<AddExceptioncodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _traceabilityService: TraceabilityService,
    private _notificationService: SharedNotificationService
  ) {
    this.traceabilityPlanification = data.traceabilityPlanification;
    this.traceability = data.traceability;
    this.exceptionalCode = new ExceptionalCode();
  }

  ngOnInit(): void {
    this._traceabilityService.onShapesChanged.subscribe((shapes) => {
      this.shapes = shapes;
    });
  }

  addExceptionCode(form: NgForm): void {
    if (form.valid) {
      this.exceptionalCode.traceabilityId = this.traceability.id;
      this._traceabilityService.addExceptionCode(this.exceptionalCode)
        .subscribe((addedTraceabilityItem) => {
          if (this.traceability.traceabilityItems == null) {
            this.traceability.traceabilityItems = [];
          }
          this.traceability.traceabilityItems.push(addedTraceabilityItem);
          this.refreshData(this.traceability);
          this.matDialogRef.close();
        }, (err) => {
          console.log(err);
          this._notificationService.showStandarError();
        });
    }
  }

  refreshData(traceability: Traceability): void {
    if (this.traceabilityPlanification.items == null) {
      this.traceabilityPlanification.items = [];
    }
    const index = this.traceabilityPlanification.items.findIndex(item => item.id === traceability.id);
    if (index >= 0) {
      this.traceabilityPlanification.items[index] = traceability;
    } else {
      this.traceabilityPlanification.items.push(this.traceability);
    }
    const traceabilityPlanification = JSON.parse(JSON.stringify(this.traceabilityPlanification));
    this._traceabilityService.onTaceabilityPlanificationChanged.next(traceabilityPlanification);
  }

}
