import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonService } from "app/common/services/common.service";
import { TonnageService } from "./tonnage.service";
import { Habilitation } from "../access-rights/models/habilitation";
import { MatDialog } from "@angular/material/dialog";
import { AddTonnageDialogComponent } from "./dialogs/add-tonnage-dialog/add-tonnage-dialog.component";
import { Tonnage } from "./models/tonnage";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { MatDrawer } from "@angular/material/sidenav";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "tonnage",
  templateUrl: "./tonnage.component.html",
})
export class TonnageComponent implements OnInit {
  currentTonnage: Tonnage;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  @ViewChild("drawer") drawer: MatDrawer;

  constructor(
    public commonService: CommonService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,

    private _tonnageService: TonnageService,
    private _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes("lg")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
          this.disableClose = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
          this.disableClose = false;
        }
      });
    this._tonnageService.onCurrentTonnageChanged.subscribe((currentTonnage) => {
      if (!currentTonnage) {
        this.currentTonnage = null;
      } else {
        this.currentTonnage = currentTonnage;
      }
    });
    this._tonnageService.onHabilitationLoaded.subscribe(
      (habilitationResult) => {
        this.habilitation = habilitationResult;
      }
    );
  }

  addTonnage(): void {
    this.dialogRef = this._matDialog.open(AddTonnageDialogComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "new",
      },
    });
  }
}
