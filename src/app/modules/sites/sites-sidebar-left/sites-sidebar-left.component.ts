import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SitesService } from '../sites.service';
import * as moment from 'moment';
import { CommonService } from 'app/common/services/common.service';
import { SiteType } from '../models/siteType';
import { SiteFilter } from '../models/siteFilter';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { PritSiteListsParams } from '../models/pritSiteListsParams';
import { SitesComponent } from '../sites.component';

@Component({
  selector: 'sites-sidebar-left',
  templateUrl: './sites-sidebar-left.component.html'
})
export class SitesSidebarLeftComponent implements OnInit {
  siteTypes: SiteType[];
  filtreListTypes: any[];
  siteFilter: SiteFilter;
  typesIdentifiers: number[];
  stats: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _sitesService: SitesService,
    public sitesComponent: SitesComponent,
    public commonService: CommonService) {
  }

  ngOnInit(): void {
    this._sitesService.onSiteFilterChanged.subscribe((siteFilter) => {
      this.siteFilter = siteFilter;
    });
    this._sitesService.onSiteTypesChanged.subscribe((siteTypes) => {
      this.siteTypes = siteTypes;
    });
    this._sitesService.onFiltreListTypesChanged.subscribe((filtreListTypes) => {
      this.filtreListTypes = filtreListTypes;
    });
    this._sitesService.getShortStats().subscribe((stats) => {
      this.stats = stats;
    });
    this._sitesService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getFiltredSites(): void {
    this.siteFilter.startIndex = 0;
    this._sitesService.onSiteFilterChanged.next(this.siteFilter);
    this._sitesService.getFiltredSites(this.siteFilter)
      .subscribe((filtredSites) => {
        this._sitesService.onFiltredSitesChanged.next(filtredSites);
      }, (err) => {
         console.log(err);
      });
  }

  PrintSitesLists(): void {
    const parameters: PritSiteListsParams = {
      typesIdentifiers: this.typesIdentifiers
    };
    this._sitesService.printSitesLists(parameters)
      .subscribe((data) => {
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        const fileName = `sites_${moment().format('DDMMYYYY')}.xlsx`;
        link.download = fileName;
        link.click();
      }, (err) => {
        console.log(err);
      });
  }
}






