import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SitesService } from './sites.service';
import { SiteFilter } from 'app/main/sites/models/siteFilter';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddSiteDialogComponent } from './dialogs/add-site-dialog/add-site-dialog.component';
import { Habilitation } from '../access-rights/models/habilitation';

@Component({
  selector: 'sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SitesComponent implements OnInit {
  siteFilter: SiteFilter;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public commonService: CommonService,
    private _loaderService: NgxUiLoaderService,
    private _sitesService: SitesService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._sitesService.onSiteFilterChanged.subscribe((siteFilter) => {
      this.siteFilter = siteFilter;
    });
    this._sitesService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addSite(): void {
    this.dialogRef = this._matDialog.open(AddSiteDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  getFiltredSites(): void {
    this._loaderService.start();
    this.siteFilter.startIndex = 0;
    this._sitesService.onSiteFilterChanged.next(this.siteFilter);
    this._sitesService.getFiltredSites(this.siteFilter)
      .subscribe((filtredSites) => {
        this._sitesService.onFiltredSitesChanged.next(filtredSites);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

}
