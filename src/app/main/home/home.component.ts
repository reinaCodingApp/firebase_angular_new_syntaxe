import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HomeService } from './home.service';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class HomeComponent implements OnInit {
  projects: any[];
  selectedProject: any;
  activities: any[] = [];

  dateNow = moment();
  constructor(
    private fuseSidebarService: FuseSidebarService,
    private homeService: HomeService
  ) {
    setInterval(() => {
      this.dateNow = moment();
    }, 1000);

  }
  ngOnInit(): void {
    this.homeService.onActivitiesChanged.subscribe(response => {
      this.activities = response;
    });
  }
  toggleSidebar(name): void {
    this.fuseSidebarService.getSidebar(name).toggleOpen();
  }
}

