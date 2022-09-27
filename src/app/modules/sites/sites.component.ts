import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonService } from "app/common/services/common.service";
import { SitesService } from "./sites.service";
import { MatDialog } from "@angular/material/dialog";
import { AddSiteDialogComponent } from "./dialogs/add-site-dialog/add-site-dialog.component";
import { Habilitation } from "../access-rights/models/habilitation";
import { SiteFilter } from "./models/siteFilter";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "sites",
  templateUrl: "./sites.component.html",
})
export class SitesComponent implements OnInit, OnDestroy {
  @ViewChild("drawerRight") drawerRight: MatDrawer;

  siteFilter: SiteFilter;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  @ViewChild("drawer") drawer: MatDrawer;

  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;

  drawerRightMode: "over" | "side" = "over";
  drawerRightOpened: boolean = false;
  disableRightClose: boolean = false;

  constructor(
    public commonService: CommonService,
    private _sitesService: SitesService,
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._sitesService.onSiteFilterChanged.subscribe((siteFilter) => {
      this.siteFilter = siteFilter;
    });
    this._sitesService.onHabilitationLoaded.subscribe((habilitationResult) => {
      this.habilitation = habilitationResult;
    });

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

  addSite(): void {
    this.dialogRef = this._matDialog.open(AddSiteDialogComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "new",
      },
    });
    this.dialogRef.afterClosed().subscribe((response) => {});
  }

  getFiltredSites(): void {
    this.siteFilter.startIndex = 0;
    this._sitesService.onSiteFilterChanged.next(this.siteFilter);
    this._sitesService.getFiltredSites(this.siteFilter).subscribe(
      (filtredSites) => {
        this._sitesService.onFiltredSitesChanged.next(filtredSites);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
