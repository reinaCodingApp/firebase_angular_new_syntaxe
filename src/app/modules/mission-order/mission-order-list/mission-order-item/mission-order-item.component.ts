import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { AddMissionOrderComponent } from '../../dialogs/add-mission-order/add-mission-order.component';
import { MissionOrderService } from '../../mission-order.service';
import { MissionOrder } from '../../models/missionOrder';

@Component({
  selector: 'mission-order-item',
  templateUrl: './mission-order-item.component.html'
})
export class MissionOrderItemComponent implements OnInit {
  @Input() missionOrder: MissionOrder;
  private dialogRef: any;

  habilitation: Habilitation = new Habilitation(0);

  @HostBinding('class.selected')
  selected: boolean;

  constructor(
    private _missionOrderService: MissionOrderService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._missionOrderService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  updateMissionOrder(missionOrder): void {
    const updatedMissionOrder = JSON.parse(JSON.stringify(missionOrder));
    this.dialogRef = this._matDialog.open(AddMissionOrderComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        missionOrder: updatedMissionOrder
      }
    });
  }

}
