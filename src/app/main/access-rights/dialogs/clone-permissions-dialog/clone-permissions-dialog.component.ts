import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { User } from 'app/main/settings/models/user';
import { UsersService } from 'app/main/settings/users/users.service';
import { AccessRightsService } from '../../access-rights.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
    private loaderService: NgxUiLoaderService,
  ) { this.usersService.listUsers(); }

  ngOnInit(): void {
    this.usersService.onUsersChanged.subscribe(users => {
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
