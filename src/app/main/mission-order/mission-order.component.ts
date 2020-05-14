import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MissionOrderService } from './mission-order.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { MatDialog } from '@angular/material';
import { AddMissionOrderComponent } from './dialogs/add-mission-order/add-mission-order.component';
import { PaginatedMissionOrders } from './models/paginatedMissionOrders';

@Component({
  selector: 'mission-order',
  templateUrl: './mission-order.component.html',
  styleUrls: ['./mission-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MissionOrderComponent implements OnInit {
  currentMail: any;
  dialogRef: any;
  length = 20;
  paginatedMissionOrders: PaginatedMissionOrders;
  habilitation: Habilitation = new Habilitation(0);
  isScrolling: boolean;

  constructor(
    private _missionOrderService: MissionOrderService,
    private _fuseSidebarService: FuseSidebarService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._missionOrderService.onMissionOrdersChanged
      .subscribe(paginatedMissionOrders => {
        this.paginatedMissionOrders = paginatedMissionOrders;
      });
    this._missionOrderService.onCurrentMissionOrderChanged
      .subscribe(currentMail => {
        if (!currentMail) {
          this.currentMail = null;
        }
        else {
          this.currentMail = currentMail;
        }
      });
    this._missionOrderService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addMissionOrder(): void {
    this.dialogRef = this._matDialog.open(AddMissionOrderComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
        missionOrder: null
      }
    });
  }

  onScroll(): void {
    if (!(this.paginatedMissionOrders.missionOrders.length >= this.paginatedMissionOrders.total)) {
      this.isScrolling = true;
      this.paginatedMissionOrders.start += this.length;
      this._missionOrderService.getMoreMissionOrders(this.paginatedMissionOrders.start, 20)
        .subscribe((paginatedMissionOrders) => {
          this.isScrolling = false;
          const newMissionOrders = this._missionOrderService.onMissionOrdersChanged.getValue().missionOrders;
          newMissionOrders.push(...paginatedMissionOrders.missionOrders);
          paginatedMissionOrders.missionOrders = newMissionOrders;
          this._missionOrderService.onMissionOrdersChanged.next(paginatedMissionOrders);
        }, err => {
          this.isScrolling = false;
          console.log(err);
        });
    }
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

}
