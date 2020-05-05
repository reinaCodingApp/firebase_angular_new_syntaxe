import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangelogService } from './changelog.service';
import { AddVersionDialogComponent } from './dialogs/add-version-dialog/add-version-dialog.component';
import { AppService } from 'app/app.service';
import { Habilitation } from './../access-rights/models/habilitation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { User } from '../settings/models/user';
import { MatDialog } from '@angular/material';
import { AppVersion, VersionDetail } from './models/app-version';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
  animations: fuseAnimations
})
export class ChangelogComponent implements OnInit, OnDestroy {
  currentUser: User;
  appVersions: AppVersion[] = null;
  unsubscribeAll = new Subject<any>();
  constructor(private appService: AppService,
              private changelogService: ChangelogService,
              private _matDialog: MatDialog) {
    this.appService.onCurentUserChanged
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(result => {
      if (result) {
        this.currentUser = result;
      }
    });
   }
  popupNewVersion(): void {
    if (this.currentUser && this.currentUser.customClaims.isRoot === true) {
      this._matDialog.open(AddVersionDialogComponent, {
        panelClass: 'mail-compose-dialog',
      });
    }
  }
  ngOnInit() {

    this.changelogService.onAppVersionsChanged
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(response => {
      if (response) {
        this.appVersions = response;
      }
    });
    this.appService.onAppVersionChanged.
    pipe(takeUntil(this.unsubscribeAll))
    .subscribe(response => {
      if (this.appService.latestKnownAppVersion.versionCode < response.versionCode){
        window.location.reload();
      }
    });
  }
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
