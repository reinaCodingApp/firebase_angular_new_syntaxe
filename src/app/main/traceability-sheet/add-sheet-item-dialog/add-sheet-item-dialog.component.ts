import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { SheetItem } from 'app/main/traceability-sheet/models/sheetItem';
import { TraceabilityColor } from 'app/main/traceability-sheet/models/traceabilityColor';
import { TraceabilitySheetService } from '../traceability-sheet.service';

@Component({
  selector: 'app-add-sheet-item-dialog',
  templateUrl: './add-sheet-item-dialog.component.html',
  styleUrls: ['./add-sheet-item-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSheetItemDialogComponent implements OnInit {
  sheetItem: SheetItem;
  selectedMaterialType: any;
  colors: TraceabilityColor[];
  materialTypes = [
    {
      id: 7,
      imgSrc: 'assets/traceabilitySheet/stick.png'
    },
    {
      id: 5,
      imgSrc: 'assets/traceabilitySheet/colson.png'
    },
    {
      id: 6,
      imgSrc: 'assets/traceabilitySheet/feuillard.png'
    },
    {
      id: 1,
      imgSrc: 'assets/traceabilitySheet/scotch.png'
    },
    {
      id: 2,
      imgSrc: 'assets/traceabilitySheet/pic.png'
    }

  ];

  constructor(
    public matDialogRef: MatDialogRef<AddSheetItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _traceabilitySheetService: TraceabilitySheetService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    this.sheetItem = new SheetItem();
    this.selectedMaterialType = this.materialTypes[0];
  }

  ngOnInit(): void {
    this._traceabilitySheetService.onColorsChanged.subscribe((colors) => {
      this.colors = colors;
    });
  }

  addSheetItem(form: NgForm): void {
    if (form.valid) {
      if (this.sheetItem.numberStart >= this.sheetItem.numberEnd) {
        this._notificationService.showWarning('Numéro de fin doit être supérieur à numéro de début');;
        return;
      }
      this.sheetItem.sheetId = this.data.traceabilitySheet.id;
      this.sheetItem.materialTypeId = this.selectedMaterialType.id;
      this._traceabilitySheetService.addTraceabilitySheetItem(this.sheetItem)
        .subscribe((createdSheetItem) => {
          this.matDialogRef.close({ success: true, createdSheetItem: createdSheetItem });
        }, (err) => {
          console.log(err);
        });
    }
  }

  initForm(): void {
    this.sheetItem = new SheetItem();
  }

}



