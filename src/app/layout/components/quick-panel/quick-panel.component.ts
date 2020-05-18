import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { AppService } from 'app/app.service';
import { FollowupSheetService } from 'app/main/followup-sheet/followup-sheet.service';
import { Deadline } from 'app/main/followup-sheet/models/deadline';

@Component({
  selector: 'quick-panel',
  templateUrl: './quick-panel.component.html',
  styleUrls: ['./quick-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit {
  hours: any[];
  showSettingsButton: boolean;
  pendingTasks: Deadline[];

  constructor(
    public commonService: CommonService,
    private appService: AppService,
    private followupSheetService: FollowupSheetService) { }

  ngOnInit(): void {
    this.commonService.getPrayerHours().subscribe(response => {
      if (response && response.code && response.code === 200) {
        this.hours = response.results.datetime[0].times;
        console.log('hours', this.hours);
      }
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    });

    this.appService.onCurentUserChanged.subscribe(user => {
      if (user) {
        this.showSettingsButton = user.customClaims.isRoot || user.customClaims.isTechAdmin;
      }
    });

    this.followupSheetService.getPendingTasks().subscribe((pendingTasks) => {
      this.pendingTasks = pendingTasks;
    });
  }
}
