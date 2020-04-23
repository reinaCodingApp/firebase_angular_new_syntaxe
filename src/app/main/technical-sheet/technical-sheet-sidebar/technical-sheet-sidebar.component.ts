import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Site } from 'app/common/models/site';
import { fuseAnimations } from '@fuse/animations';
import { TechnicalSheetFilter } from 'app/main/technical-sheet/models/technicalSheetFilter';
import { TechnicalSheetService } from '../technical-sheet.service';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'technical-sheet-sidebar',
  templateUrl: './technical-sheet-sidebar.component.html',
  styleUrls: ['./technical-sheet-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TechnicalSheetSidebarComponent implements OnInit {
  technicalSheetFilter: TechnicalSheetFilter;
  sites: Site[];
  technicalSheets: TechnicalSheet[];
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _technicalSheetService: TechnicalSheetService,
    private _loaderService: NgxUiLoaderService
    ) {
    this.technicalSheets = [];
  }

  ngOnInit(): void {
    this._technicalSheetService.onTechnicalSheetFilterChanged.subscribe((technicalSheetFilter) => {
      this.technicalSheetFilter = technicalSheetFilter;
    });
    this._technicalSheetService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
    });
    this._technicalSheetService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getTechnicalSheets(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this._technicalSheetService.getTechnicalSheets(this.technicalSheetFilter)
        .subscribe((technicalSheets) => {
          this.technicalSheets = technicalSheets;
          this._technicalSheetService.onTechnicalSheetsChanged.next(technicalSheets);
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }
}





