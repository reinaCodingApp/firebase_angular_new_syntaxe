import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuditTemplate } from 'app/main/audit/models/audit-template';
import { fuseAnimations } from '@fuse/animations';
import { AuditsService } from '../audit.service';
import { MatDialog } from '@angular/material';
import { PossibleValue } from 'app/main/audit/models/possible-value';
import { AddAuditDialogComponent } from '../dialogs/add-audit-dialog/add-audit-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { Subject } from 'rxjs';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-administration',
  templateUrl: './audit-administration.component.html',
  styleUrls: ['./audit-administration.component.scss'],
  animations: fuseAnimations
})
export class AuditAdministrationComponent implements OnInit, OnDestroy {

  templates: AuditTemplate[] = [];
  selectedTemplate: AuditTemplate;
  possibleValues: PossibleValue[] = [];
  dialogRef: any;
  poleId: string;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any>;
  constructor(
    private auditsService: AuditsService,
    private _matDialog: MatDialog,
    private notificationService: SharedNotificationService,
    private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.poleId = params.poleId;
    })
    this.unsubscribeAll = new Subject();
  }

  popupNewTemplate(): void {
    this.dialogRef = this._matDialog.open(AddAuditDialogComponent, {
      panelClass: 'add-audit-dialog',
      data: {
        action: 'new-template',
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response && response.template) {
          const template = response.template as AuditTemplate;
          template.poleId = this.poleId;
          this.auditsService.addTemplate(template).then(result => {
            console.log('tempalte added', result);
          });
        }
      });

  }
  removeTemplate(template: AuditTemplate): void {
    this.auditsService.getTemplateMenu(template).subscribe((data) => {
      if (data.exists) {
        const templateDetails = data.data() as AuditTemplate;
        if (!templateDetails.menus || templateDetails.menus.length === 0) {
          this.auditsService.deleteTemplate(template).then(() => {
            this.notificationService.showSuccess(`Le modèle est supprimé avec succès`);
          });
        } else {
          this.notificationService.showError(`L'pération est refusée car le template n'est pas vide`);
        }
      }
    });
  }

  ngOnInit() {
    this.auditsService.onTemplatesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.templates = data;
      });
    this.auditsService.onPossibleValuesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(values => {
        this.possibleValues = values;
        console.log(this.possibleValues);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
