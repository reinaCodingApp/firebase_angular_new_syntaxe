import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditsService } from '../audit.service';
import { Audit } from '../models/audit';

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
        }
      });
    this.auditsService.onSectionsChanged.subscribe(sections => {
      if (sections && this.audit && this.audit.menus) {
        this.audit.menus[0].sections = sections;
      }
    });
  }
}

