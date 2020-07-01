import { AuditsService } from './../audit.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Audit } from 'app/main/audit/models/audit';
import { AuditMenu } from 'app/main/audit/models/audit-menu';
import { AuditItem } from 'app/main/audit/models/audit-item';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Attachment } from 'app/common/models/attachment';

@Component({
  selector: 'audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuditDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  animationDirection: 'left' | 'right' | 'none';
  currentStep: number;
  currentAudit: Audit = null;
  currentMenu: AuditMenu = new AuditMenu();
  totalMenusCount = 0;
  private dialogRef: any;
  isDraft: boolean;
  habilitation: Habilitation = new Habilitation(0);

  @ViewChildren(FusePerfectScrollbarDirective)
  fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

  // Private
  private unsubscribeAll: Subject<any>;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseSidebarService: FuseSidebarService,
    private auditsService: AuditsService,
    public matDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.isDraft = params.isDraft === 'true';
    });
    this.animationDirection = 'none';
    this.currentStep = 0;
    this.unsubscribeAll = new Subject();
    this.currentAudit = null;
    this.totalMenusCount = 0;
    this.currentMenu = null;
  }
  loadMenuSections(menu: AuditMenu, step: number) {
    this.currentMenu = menu;
    this.auditsService.getAuditSectionsAndItems(menu.id);
    this.animationDirection = this.currentStep < step ? 'left' : 'right';
    this._changeDetectorRef.detectChanges();
    this.currentStep = step;
  }
  updateEffectiveValue(item: AuditItem, value: string) {
    if (this.habilitation.canEdit() === true && this.isDraft) {
      this.auditsService.updateEffectiveValue(item, value).then(result => {
        console.log('updated', result);
      });
    }
  }
  updateAuditPrperties() {
    if (this.isDraft) {
      const auditProperties = { ...this.currentAudit };
      auditProperties.menus = [];
      this.auditsService.updateAuditPrperties(auditProperties).then(() => {
        console.log('audit updated');
      });
    }
  }
  gotoNextStep(): void {
    if (this.currentStep === this.totalMenusCount - 1) {
      return;
    }
    const step = this.currentStep + 1;
    this.loadMenuSections(this.currentAudit.menus[step], step);
  }
  gotoPreviousStep(): void {
    if (this.currentStep === 0) {
      return;
    }
    const step = this.currentStep - 1;
    this.loadMenuSections(this.currentAudit.menus[step], step);
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  ngOnInit(): void {
    this.auditsService.onCurrentAuditChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(current => {
        this.currentAudit = current;
        if (this.currentAudit && this.currentAudit.menus && this.currentAudit.menus.length > 0) {
          this.currentMenu = this.currentAudit.menus[0];
          this.auditsService.getAuditSectionsAndItems(this.currentMenu.id);
          this.currentAudit.menus.push({ id: '', title: 'Rapport' } as AuditMenu);
          this.totalMenusCount = this.currentAudit.menus.length;
        }
      });
    this.auditsService.onSectionsChanged.subscribe(sections => {
      if (sections) {
        this.currentMenu.sections = sections;
      }
    });
    this.auditsService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });

    this.auditsService.onAttachmentUploaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(response => {
        if (response) {
          this.currentAudit.attachments.push({ ...response });
          this.updateAuditPrperties();
          this.auditsService.onAttachmentUploaded.next(null);
        }
      });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  saveAudit() {
    this.dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Valider audit',
        message: 'Confirmez-vous la validation de de cet audit ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.auditsService.saveAudit(this.currentAudit);
        }
      });
  }

  attachmentPicked(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      this.auditsService.storeAttachment(file)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(pourcentage => {
          if (pourcentage === 100) {
            console.log('upload complete');
          }
        });
    }
  }

  removeAttachment(attachment: Attachment): void {
    const index = this.currentAudit.attachments.indexOf(attachment);
    if (index >= 0) {
      this.currentAudit.attachments.splice(index, 1);
      this.updateAuditPrperties();
    }
  }
}
