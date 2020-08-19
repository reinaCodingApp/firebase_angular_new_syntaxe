import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditsService } from '../audit.service';
import { Audit } from '../models/audit';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { AuditStats, PointStat } from '../models/auditStats';

@Component({
  selector: 'audit-print',
  templateUrl: './audit-print.component.html',
  styleUrls: ['./audit-print.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuditPrintComponent implements OnInit {
  auditId: string;
  audit: Audit;
  auditStats: AuditStats = new AuditStats();

  constructor(
    private auditsService: AuditsService,
    private _fuseConfigService: FuseConfigService,
    private _loaderService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.params.subscribe(params => {
      this.auditId = params.auditId;
      this.getAudit();
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: { hidden: true },
        footer: { hidden: true },
      }
    };
  }

  ngOnInit(): void {
  }

  generateAuditPDF(): void {
    this._loaderService.start();
    const auditToPrint = {
      audit: this.audit,
      auditStats: this.auditStats
    };
    this.auditsService.generateAuditPDF(auditToPrint)
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

  generateAuditStats(audit: Audit) {
    audit.menus.forEach(menu => {
      if (menu.report && menu.report.length > 0) {
        this.auditStats.reportsTotal = this.auditStats.reportsTotal + 1;
      }
      menu.sections.forEach(section => {
        section.items.forEach(item => {
          // Calculate checked points
          if (item.effectiveValue) {
            const pointIndex = this.auditStats.pointsStat.findIndex(p => p.effectiveValue === item.effectiveValue);
            if (pointIndex > -1) {
              this.auditStats.pointsStat[pointIndex].total += 1;
            } else {
              const point: PointStat = { effectiveValue: item.effectiveValue, total: 1 };
              this.auditStats.pointsStat.push(point);
            }
          } else {
            this.auditStats.notCheckedPointsTotal += 1;
          }
        });
      });
    });
  }

  async getAudit() {
    this.audit = await this.auditsService.getFullAudit(this.auditId);
    this.generateAuditStats(this.audit);
  }

}

