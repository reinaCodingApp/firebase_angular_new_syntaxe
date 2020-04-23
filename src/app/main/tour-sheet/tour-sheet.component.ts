import { Component, OnInit } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-tour-sheet',
  templateUrl: './tour-sheet.component.html',
  styleUrls: ['./tour-sheet.component.scss']
})
export class TourSheetComponent implements OnInit {

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
