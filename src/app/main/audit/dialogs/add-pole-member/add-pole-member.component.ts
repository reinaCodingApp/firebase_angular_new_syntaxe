import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'app/main/settings/models/user';
import { UsersService } from 'app/main/settings/users/users.service';
import { DefaultClaim } from 'app/common/models/default-claim';
import { AuditPole } from '../../models/audit-pole';
import { AuditsService } from '../../audit.service';

@Component({
  selector: 'app-add-pole-member',
  templateUrl: './add-pole-member.component.html',
  styleUrls: ['./add-pole-member.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPoleMemberComponent implements OnInit {
  users: User[];
  filtredUsers: User[];
  selectedUser: User;
  currentPole: AuditPole;

  constructor(
    public matDialogRef: MatDialogRef<AddPoleMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private auditsService: AuditsService
  ) {
    this.currentPole = data.pole;
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

  searchUser(searchInput): void {
    if (!this.users) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredUsers = this.users.filter(u => u.displayName.toLowerCase().indexOf(searchInput) > -1);
  }

  addMember(): void {
    const pole: AuditPole = JSON.parse(JSON.stringify(this.currentPole));
    const selecteMember = {
      uid: this.selectedUser.uid,
      displayName: this.selectedUser.displayName,
      email: this.selectedUser.email
    };
    if (!pole.members) {
      pole.members = [];

    }
    if (!pole.members.some(m => m.uid === selecteMember.uid)) {
      pole.members.push(selecteMember);
      this.auditsService.updateAuditPoleMembers(pole).then(() => {
        if (!this.currentPole.members) {
          this.currentPole.members = [];
        }
        this.currentPole.members.push(selecteMember);
      });
    }
  }

  deleteMember(member): void {
    const pole: AuditPole = JSON.parse(JSON.stringify(this.currentPole));
    const index = pole.members.findIndex(m => m.uid === member.uid);
    if (index > -1) {
      pole.members.splice(index, 1);
      this.auditsService.updateAuditPoleMembers(pole).then(() => {
        this.currentPole.members.splice(index, 1);
      });
    }
  }

}

