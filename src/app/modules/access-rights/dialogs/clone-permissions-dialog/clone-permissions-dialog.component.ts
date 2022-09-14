import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { User } from 'app/modules/settings/models/user';
import { UsersService } from 'app/modules/settings/users/users.service';
import { AccessRightsService } from '../../access-rights.service';
import { DefaultClaim } from 'app/common/models/default-claim';

@Component({
  selector: 'app-clone-permissions-dialog',
  templateUrl: './clone-permissions-dialog.component.html',
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
    private accessRightsService: AccessRightsService
  ) {
  }

  ngOnInit(): void {
    this.usersService.listUsers().subscribe((response) => {
      let users = response.data.map((u) => {
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
      this.accessRightsService.loadAccessRightsToClone(this.selectedUserUid)
        .then(() => {
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
