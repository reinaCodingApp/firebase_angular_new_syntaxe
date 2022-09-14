import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MissionOrderService } from '../mission-order.service';
import { MissionOrder } from '../models/missionOrder';

@Component({
  selector: 'mission-order-list',
  templateUrl: './mission-order-list.component.html'
})
export class MissionOrderListComponent implements OnInit {
  @Input() isScrolling: boolean;
  @Input() completed: boolean;
  @Output() getMore: EventEmitter<any> = new EventEmitter();
  missionOrders: MissionOrder[] = [];
  currentMissionOrder: MissionOrder;

  constructor(private _missionOrderService: MissionOrderService) { }

  ngOnInit(): void {
    this._missionOrderService.onMissionOrdersChanged
      .subscribe(paginatedMissionOrders => {
        this.missionOrders = paginatedMissionOrders.missionOrders;
      });
  }

  readMail(currentMissionOrder): void {
    this.currentMissionOrder = currentMissionOrder;
    this._missionOrderService.onCurrentMissionOrderChanged.next(currentMissionOrder);
  }

}
