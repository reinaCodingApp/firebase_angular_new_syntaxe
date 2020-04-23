import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-activity-statistics',
  templateUrl: './activity-statistics.component.html',
  styleUrls: ['./activity-statistics.component.scss'],
  animations: fuseAnimations
})
export class ActivityStatisticsComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit() {
  }

}
