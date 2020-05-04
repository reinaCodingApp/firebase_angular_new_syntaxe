import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { User } from 'app/main/settings/models/user';
import { UsersService } from 'app/main/settings/users/users.service';
import { AccessRightsService } from '../../access-rights.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DefaultClaim } from 'app/common/models/default-claim';

@Component({
  selector: 'app-clone-permissions-dialog',
  templateUrl: './clone-permissions-dialog.component.html',
  styleUrls: ['./clone-permissions-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClonePermissionsDialogComponent implements OnInit {
  users: User[];
  filtredUsers: User[];
  selectedUserUid: string;

  constructor(
    public matDialogRef: MatDialogRef<ClonePermissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private accessRightsService: AccessRightsService,
    private loaderService: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this.usersService.listUsers().then(response => {
      let users = response.data.map(u => {
        const result = { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } as User;
        if (u.customClaims) {
          result.customClaims = (u.customClaims as DefaultClaim);
        }
        return result;
      });
      users = users.sort((a, b) => a.displayName.localeCompare(b.displayName));
      this.users = users;
      this.filtredUsers = users;
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.loaderService.start();
      this.accessRightsService.loadAccessRightsToClone(this.selectedUserUid)
        .then(() => {
          this.loaderService.stop();
          this.matDialogRef.close();
        });
    }
  }

  searchUser(searchInput): void {
    if (!this.users) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredUsers = this.users.filter(u => u.displayName.toLowerCase().indexOf(searchInput) > -1);
  }

}
