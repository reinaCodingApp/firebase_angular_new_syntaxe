import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditsService } from '../audit.service';
import { Audit } from '../models/audit';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';

@Component({
  selector: 'audit-print',
  templateUrl: './audit-print.component.html',
  styleUrls: ['./audit-print.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuditPrintComponent implements OnInit {
  auditId: string;
  audit: Audit;

  constructor(
    private auditsService: AuditsService,
    private _fuseConfigService: FuseConfigService,
    private _loaderService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.params.subscribe(params => {
      this.auditId = params.auditId;
      if (!this.audit) {
        this.auditsService.getAuditMenus(this.auditId);
      }
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: { hidden: true },
        footer: { hidden: true },
      }
    };
  }

  ngOnInit(): void {
    this.auditsService.onCurrentAuditChanged
      .subscribe(current => {
        this.audit = current;
        if (this.audit) {
          this.audit = this.auditsService.getAllAuditSectionsAndItems(this.audit);
          console.log('### this.audit', this.audit);
        }
      });
    this.auditsService.onSectionsChanged.subscribe(sections => {
      if (sections && this.audit && this.audit.menus) {
        this.audit.menus[0].sections = sections;
      }
    });
  }

  generateAuditPDF(): void {
    this._loaderService.start();
    this.auditsService.generateAuditPDF(this.audit)
      .subscribe((data) => {
        this._loaderService.stop();
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        const fileName = `${this.audit.site ? this.audit.site.name : this.audit.department.name}_${moment().format('DD-MM-YYYY')}.pdf`;
        link.download = fileName;
        link.click();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

}

