import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SitesService } from '../sites.service';
import { fuseAnimations } from '@fuse/animations';
import { Site } from 'app/common/models/site';
import { PrintAgreemntParams } from 'app/main/sites/models/printAgreemntParams';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'sites-sidebar-right',
  templateUrl: './sites-sidebar-right.component.html',
  styleUrls: ['./sites-sidebar-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SitesSidebarRightComponent implements OnInit {
  sites: Site[];
  selectedSite: Site;
  selectedSites: Site[] = [];
  constructor(
    private _sitesService: SitesService,
    private _loaderService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this._sitesService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
    });
  }

  printAgreement(): void {
    this._loaderService.start();
    const siteIdentifiers: number[] = [];
    this.selectedSites.forEach(site => {
      siteIdentifiers.push(site.id);
    });
    const parameters: PrintAgreemntParams = {
      siteIdentifiers: siteIdentifiers
    };
    this._sitesService.printAgreement(parameters).subscribe((result) => {
      this._loaderService.stop();
      const blob = new Blob([result], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  addSiteForPrint(): void {
    if (this.selectedSites.length < 3 && this.selectedSite) {
      this.selectedSites.push(this.selectedSite);
    }
  }

  removeSite(index: number): void {
    this.selectedSites.splice(index, 1);
  }

}
