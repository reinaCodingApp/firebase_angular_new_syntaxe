import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { AppService } from 'app/app.service';

@Component({
  selector: 'quick-panel',
  templateUrl: './quick-panel.component.html',
  styleUrls: ['./quick-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit {
  hours: any[];
  showSettingsButton: boolean;

  constructor(
    public commonService: CommonService,
    private appService: AppService) { }

  ngOnInit(): void {
    this.commonService.getPrayerHours().subscribe(response => {
      if (response && response.code && response.code === 200) {
        this.hours = response.results.datetime[0].times;
        console.log('hours', this.hours);
      }
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    });

    this.appService.getCurrentUser().subscribe(user => {
      if (user) {
        this.showSettingsButton = user.customClaims.isRoot || user.customClaims.isTechAdmin;
      }
    });
  }
}
