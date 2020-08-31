import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CommonService } from 'app/common/services/common.service';
import { TonnageService } from './tonnage.service';
import { Tonnage } from 'app/main/tonnage/models/tonnage';
import { Habilitation } from '../access-rights/models/habilitation';
import { MatDialog } from '@angular/material/dialog';
import { AddTonnageDialogComponent } from './dialogs/add-tonnage-dialog/add-tonnage-dialog.component';

@Component({
  selector: 'tonnage',
  templateUrl: './tonnage.component.html',
  styleUrls: ['./tonnage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TonnageComponent implements OnInit {
  currentTonnage: Tonnage;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public commonService: CommonService,
    private _tonnageService: TonnageService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._tonnageService.onCurrentTonnageChanged
      .subscribe(currentTonnage => {
        if (!currentTonnage) {
          this.currentTonnage = null;
        }
        else {
          this.currentTonnage = currentTonnage;
        }
      });
    this._tonnageService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addTonnage(): void {
    this.dialogRef = this._matDialog.open(AddTonnageDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
  }

}

