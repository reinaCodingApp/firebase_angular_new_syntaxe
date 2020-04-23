import { Component, OnInit } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-recap-activity',
  templateUrl: './recap-activity.component.html',
  styleUrls: ['./recap-activity.component.scss']
})
export class RecapActivityComponent implements OnInit {

  constructor(
    private _fuseSidebarService: FuseSidebarService
  ) {
  }

  ngOnInit(): void {
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


}
