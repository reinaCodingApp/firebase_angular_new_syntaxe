import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "app/common/services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { AddTraceabilityDialogComponent } from "./dialogs/add-traceability-dialog/add-traceability-dialog.component";
import { TraceabilityPlanification } from "./models/descending/traceabilityPlanification";
import { TraceabilityService } from "./traceability.service";
import { Habilitation } from "../access-rights/models/habilitation";
import { MatDrawer } from "@angular/material/sidenav";
import { Subject, takeUntil } from "rxjs";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";

@Component({
  selector: "app-traceability",
  templateUrl: "./traceability.component.html",
})
export class TraceabilityComponent implements OnInit {
  dialogRef: any;
  traceabilityPlanification: TraceabilityPlanification;
  habilitation: Habilitation = new Habilitation(0);
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  private _unsubscribeAll: Subject<any>;

  @ViewChild("drawer") drawer: MatDrawer;

  constructor(
    public commonService: CommonService,
    private matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private traceabilityService: TraceabilityService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
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

    this.traceabilityService.onTaceabilityPlanificationChanged.subscribe(
      (response) => {
        this.traceabilityPlanification = response;
      }
    );
    this.traceabilityService.onHabilitationLoaded.subscribe(
      (habilitationResult) => {
        this.habilitation = habilitationResult;
      }
    );
  }
  popupAddTraceability(): void {
    this.dialogRef = this.matDialog.open(AddTraceabilityDialogComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "new",
        traceabilityPlanification: this.traceabilityPlanification,
      },
    });
    this.dialogRef.afterClosed().subscribe((response) => {});
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
