import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { TechnicalSheetService } from '../technical-sheet.service';


@Component({
  selector: 'technical-sheet-list',
  templateUrl: './technical-sheet-list.component.html',
  styleUrls: ['./technical-sheet-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TechnicalSheetListComponent implements OnInit {
  technicalSheets: TechnicalSheet[] = [];
  currentTechnicalSheet: TechnicalSheet;

  constructor(
    private _technicalSheetService: TechnicalSheetService,
    private _loaderService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this._technicalSheetService.onTechnicalSheetsChanged
      .subscribe(technicalSheets => {
        this.technicalSheets = technicalSheets;
      });
  }

  getTechnicalSheetDetails(currentTechnicalSheet: TechnicalSheet): void {
    this._loaderService.start();
    this._technicalSheetService.getTechnicalSheetDetails(currentTechnicalSheet)
      .subscribe((technicalSheet) => {
        this._technicalSheetService.onCurrentTechnicalSheetChanged.next(technicalSheet);
        this.currentTechnicalSheet = technicalSheet;
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

}


