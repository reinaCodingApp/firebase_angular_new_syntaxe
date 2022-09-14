import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-activity-statistics",
  templateUrl: "./activity-statistics.component.html",
})
export class ActivityStatisticsComponent implements OnInit {
  @ViewChild("drawer") drawer: MatDrawer;

  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService) {
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
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
