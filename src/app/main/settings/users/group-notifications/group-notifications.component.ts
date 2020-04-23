import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from 'app/main/settings/models/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupNotificationsService } from './group-notifications.service';
import { GroupNotification } from './models/groupNotification';

@Component({
  selector: 'group-notifications',
  templateUrl: './group-notifications.component.html',
  styleUrls: ['./group-notifications.component.scss']
})
export class GroupNotificationsComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filtredUsers: User[] = [];
  groupsNotifications: GroupNotification[];
  selectedGroup: GroupNotification;

  groupNotificationsName: string;
  private unsubscribeAll: Subject<any>;

  constructor(
    private usersService: UsersService,
    private groupNotificationsService: GroupNotificationsService) {
    this.unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.groupNotificationsService.getGroups();
    this.usersService.onUsersChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(users => {
        this.users = users;
        this.filtredUsers = users;
      });
    this.groupNotificationsService.onGroupsNotifactionsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(groupsNotifications => {
        this.groupsNotifications = groupsNotifications;
      });
  }

  addEmail(email: any): void {
    this.selectedGroup.emails.push(email.value);
    this.updateGroupNotifications();
  }

  removeEmail(emailIndex: number): void {
    this.selectedGroup.emails.splice(emailIndex, 1);
    this.updateGroupNotifications();
  }

  addNewGroupNotifications(): void {
    this.groupNotificationsService.addGroupNotifications(this.groupNotificationsName).then(() => {
      this.groupNotificationsName = '';
    });
  }

  updateGroupNotifications(): void {
    this.groupNotificationsService.updateGroupNotifications(this.selectedGroup);
  }

  deleteGroupNotifications(groupNotification: GroupNotification): void {
    this.groupNotificationsService.deleteGroupNotifications(groupNotification).then(() => {
        this.selectedGroup = null;
    });
  }

  searchUser(searchInput): void {
    if (!this.users) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredUsers = this.users.filter(d => d.email.toLowerCase().indexOf(searchInput) > -1);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
