import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MissionOrder } from 'app/main/mission-order/models/missionOrder';
import { MissionOrderService } from '../mission-order.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { PaginatedMissionOrders } from '../models/paginatedMissionOrders';

@Component({
  selector: 'mission-order-details',
  templateUrl: './mission-order-details.component.html',
  styleUrls: ['./mission-order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MissionOrderDetailsComponent implements OnInit {
  missionOrder: MissionOrder;
  missionOrderstatus: any[];
  currentInvoiceState: number;
  paginatedMissionOrders: PaginatedMissionOrders;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _missionOrderService: MissionOrderService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService) { }

  ngOnInit(): void {
    this._missionOrderService.onMissionOrdersChanged
    .subscribe((paginatedMissionOrders) => {
      this.paginatedMissionOrders = paginatedMissionOrders;
    });
    this.missionOrderstatus = this._missionOrderService.missionOrderstatus.filter((item) => {
      return item.value !== 2;
    });
    this._missionOrderService.onCurrentMissionOrderChanged
      .subscribe((missionOrder) => {
        this.missionOrder = missionOrder;
        if (missionOrder) {
          this.currentInvoiceState = this.missionOrder.isInvoiced ? 1 : 0;
        }
      });
    this._missionOrderService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getTotalFrais(): string {
    return this._missionOrderService.getTotalFrais(this.missionOrder);
  }

  getTotalFraisPerso(): string {
    return this._missionOrderService.getTotalFraisPerso(this.missionOrder);
  }

  getTotalIntervenants(): string {
    return this._missionOrderService.getTotalIntervenants(this.missionOrder);
  }

  getTotal(): string {
    return this._missionOrderService.getTotal(this.missionOrder);
  }

  changeState(missionOrder: MissionOrder): void {
    this._loaderService.start();
    this._missionOrderService.changeState(missionOrder.id, this.currentInvoiceState)
      .subscribe((result) => {
        this._loaderService.stop();
        if (result) {
          this._notificationService.showSuccess('Opération terminé avec succés');
          const missionOrderIndex = this.paginatedMissionOrders.missionOrders.findIndex(m => m.id === missionOrder.id);
          if (missionOrderIndex > -1) {
            missionOrder.isInvoiced = !missionOrder.isInvoiced;
            this.paginatedMissionOrders.missionOrders[missionOrderIndex] = missionOrder;
          }
        } else {
          this._notificationService.showStandarError();
        }
      }, (err) => {
        this._loaderService.stop();
        this._notificationService.showStandarError();
        console.log(err);
      });
  }

  print(): void {
    window.print();
  }

}
