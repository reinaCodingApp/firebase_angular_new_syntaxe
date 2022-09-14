import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MissionOrderService } from "./mission-order.service";
import { fuseAnimations } from "@fuse/animations";
import { Habilitation } from "../access-rights/models/habilitation";
import { MatDialog } from "@angular/material/dialog";
import { AddMissionOrderComponent } from "./dialogs/add-mission-order/add-mission-order.component";
import { PaginatedMissionOrders } from "./models/paginatedMissionOrders";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "mission-order",
  templateUrl: "./mission-order.component.html",
})
export class MissionOrderComponent implements OnInit {
  currentMail: any;
  dialogRef: any;
  length = 20;
  paginatedMissionOrders: PaginatedMissionOrders;
  habilitation: Habilitation = new Habilitation(0);
  isScrolling: boolean;
  @ViewChild("drawer") drawer: MatDrawer;

  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  constructor(
    private _missionOrderService: MissionOrderService,
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._missionOrderService.onMissionOrdersChanged.subscribe(
      (paginatedMissionOrders) => {
        this.paginatedMissionOrders = paginatedMissionOrders;
      }
    );
    this._missionOrderService.onCurrentMissionOrderChanged.subscribe(
      (currentMail) => {
        if (!currentMail) {
          this.currentMail = null;
        } else {
          this.currentMail = currentMail;
        }
      }
    );
    this._missionOrderService.onHabilitationLoaded.subscribe(
      (habilitationResult) => {
        this.habilitation = habilitationResult;
      }
    );
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes("md")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
          this.disableClose = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
          this.disableClose = false;
        }
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  addMissionOrder(): void {
    this.dialogRef = this._matDialog.open(AddMissionOrderComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "new",
        missionOrder: null,
      },
    });
  }

  onScroll(): void {
    if (
      !(
        this.paginatedMissionOrders.missionOrders.length >=
        this.paginatedMissionOrders.total
      )
    ) {
      this.isScrolling = true;
      this.paginatedMissionOrders.start += this.length;
      this._missionOrderService
        .getMoreMissionOrders(this.paginatedMissionOrders.start, 20)
        .subscribe(
          (paginatedMissionOrders) => {
            this.isScrolling = false;
            const newMissionOrders =
              this._missionOrderService.onMissionOrdersChanged.getValue()
                .missionOrders;
            newMissionOrders.push(...paginatedMissionOrders.missionOrders);
            paginatedMissionOrders.missionOrders = newMissionOrders;
            this._missionOrderService.onMissionOrdersChanged.next(
              paginatedMissionOrders
            );
          },
          (err) => {
            this.isScrolling = false;
            console.log(err);
          }
        );
    }
  }

  toggleSidebar(name): void {}
}
