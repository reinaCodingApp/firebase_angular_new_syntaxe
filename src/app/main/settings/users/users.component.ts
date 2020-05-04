import { UsersService } from './users.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { User } from 'app/main/settings/models/user';
import { MatDialog } from '@angular/material';
import { UserFormDialogComponent } from './dialogs/user-form-dialog/user-form-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { MainTools } from 'app/common/tools/main-tools';
import { DefaultClaim } from 'app/common/models/default-claim';
import { AppService } from 'app/app.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fuseAnimations],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  usersDataSource: User[];
  filtredUsers: User[];
  columnsToDisplay = ['displayName', 'email', 'customClaims', 'buttons'];
  dialogRef: any;
  selectedUser: User;
  defaultPasswordGuard: string;
  connectedUser: User;

  constructor(
    private usersService: UsersService,
    private appService: AppService,
    public _matDialog: MatDialog) {
    this.defaultPasswordGuard = this.usersService.passwordGuard();
  }

  popup(user: User, action: string) {
    this.selectedUser = user;
    let currentClaims = this.selectedUser ? this.selectedUser.customClaims : {};
    if (action === 'edit') {
      this.selectedUser.password = this.defaultPasswordGuard;
    }
    this.dialogRef = this._matDialog.open(UserFormDialogComponent, {
      panelClass: 'user-form-dialog',
      data: { action: action, user: this.selectedUser }
    });
    this.dialogRef.afterClosed().subscribe(data => {
      if (data && data.user) {
        const u = data.user as User;
        const claims = data.claims;
        const employeeId = data.employeeId;
        u.customClaims = currentClaims;
        const updatedCustomClaims = MainTools.getObject(claims);
        u.customClaims.isRoot = updatedCustomClaims.isRoot;
        u.customClaims.isTechAdmin = updatedCustomClaims.isTechAdmin;
        u.customClaims.isGuest = updatedCustomClaims.isGuest;
        u.customClaims.isHrM = updatedCustomClaims.isHrM;
        u.customClaims.isSeM = updatedCustomClaims.isSeM;
        u.customClaims.isAdM = updatedCustomClaims.isAdM;
        u.customClaims.isDir = updatedCustomClaims.isDir;
        u.customClaims.employeeId = employeeId;
        if (data.action === 'edit') {
          this.usersService.updateUser(u).then(result => {
            this.selectedUser.displayName = result.data.displayName;
            this.selectedUser.customClaims = u.customClaims as DefaultClaim;
          });
        } else if (data.action === 'new') {
          this.usersService.createUser(u).then(result => {
            u.uid = result.data.uid;
            this.usersDataSource.push(u);
            this.usersService.onUsersChanged.next(JSON.parse(JSON.stringify(this.usersDataSource)));
          });
        }
      }
    });
  }

  ngOnInit() {
    this.appService.getCurrentUser().subscribe(user => {
      if (user) {
        this.connectedUser = user;
      }
    });
    this.usersService.onUsersChanged.subscribe(result => {
      this.usersDataSource = [...result];
      this.filtredUsers = [...result];
    });
  }

  searchUser(event): void {
    const searchInput = event.target.value.toLowerCase();
    if (!this.usersDataSource) {
      return;
    }
    this.filtredUsers = this.usersDataSource.filter(u => u.displayName.toLowerCase().indexOf(searchInput) > -1 || u.email.toLowerCase().indexOf(searchInput) > -1);
  }

}
export interface PeriodicElement {
  displayName: string;
  email: number;
  customClaims: number;
  description: string;
}

