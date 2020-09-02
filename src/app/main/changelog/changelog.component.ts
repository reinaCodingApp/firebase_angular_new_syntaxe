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
import { MatDialog } from '@angular/material/dialog';
import { AppVersion, VersionDetail } from './models/app-version';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
  animations: fuseAnimations
})
export class ChangelogComponent implements OnInit, OnDestroy {
  currentUser: User;
  appVersions: AppVersion[] = null;
  dialogRef: any;
  unsubscribeAll = new Subject<any>();
  hasWaitingVersion = true;
  constructor(
    private appService: AppService,
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
        data: {
          mode: 'new'
        }
      });
    }
  }

  publishVersion(version: AppVersion): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Publier version',
        message: 'Etes-vous sûr de vouloir publier cette version ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        } else {
          this.changelogService.publishVersion(version).then(() => {
            console.log('published');
          });
        }
      });
  }

  updateVersion(version: AppVersion) {
    if (this.currentUser && this.currentUser.customClaims.isRoot === true) {
      this._matDialog.open(AddVersionDialogComponent, {
        panelClass: 'mail-compose-dialog',
        data: {
          mode: 'edit',
          version: version
        }
      });
    }
  }

  ngOnInit(): void {
    this.changelogService.onAppVersionsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(response => {
        if (response) {
          this.appVersions = response;
          this.hasWaitingVersion = this.appVersions.length > 0 && !this.appVersions[0].published;
        }
      });
  }
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
