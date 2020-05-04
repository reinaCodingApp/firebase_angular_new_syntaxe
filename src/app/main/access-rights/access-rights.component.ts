import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AccessRightsService } from './access-rights.service';
import { takeUntil } from 'rxjs/operators';
import { Module } from 'app/main/access-rights/models/module';
import { User } from 'app/main/settings/models/user';
import { fuseAnimations } from '@fuse/animations';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { MatDialog } from '@angular/material';
import { ClonePermissionsDialogComponent } from './dialogs/clone-permissions-dialog/clone-permissions-dialog.component';


@Component({
  selector: 'app-access-rights',
  templateUrl: './access-rights.component.html',
  styleUrls: ['./access-rights.component.scss'],
  animations: fuseAnimations
})
export class AccessRightsComponent implements OnInit, OnDestroy {

  modules: Module[] = [];
  filteredModules: Module[] = [];
  displayColumns = [];
  currentUser: User;
  dialogRef: any;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private accessRightsService: AccessRightsService,
    private matDialog: MatDialog
  ) {
    this.displayColumns = ['a', ...EmbeddedDatabase.basicAccessRights];
    console.log(this.displayColumns);
  }

  ngOnInit(): void {
    this.accessRightsService.onFilteredModuleschanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(filteredModules => {
        if (filteredModules) {
          this.filteredModules = filteredModules;
          console.log('filtered modules', this.filteredModules);
        }
      });
    this.accessRightsService.onUserChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          console.log('currentuser', this.currentUser);
        }
      });
  }

  updategrantedAccess(m: Module, value: number): void {
    if (value === 1 && m.grantedAccess === value) {
      m.grantedAccess = 0;
    } else {
      m.grantedAccess = value;
    }
  }

  updateUserClaims(): void {
    this.filteredModules.forEach(m => {
      this.currentUser.customClaims[m.key] = m.grantedAccess;
    });
    console.log(this.currentUser);
    this.accessRightsService.updateUserClaims(this.currentUser).then(result => {
      console.log('update result', result);
    });
  }

  clonePermissions(): void {
    this.dialogRef = this.matDialog.open(ClonePermissionsDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        currentUser: this.currentUser
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }

  selectPermissions(status: boolean): void {
    if (status) {
      this.filteredModules.forEach(m => {
        m.grantedAccess = 7;
      });
    } else {
      this.filteredModules.forEach(m => {
        m.grantedAccess = 0;
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
