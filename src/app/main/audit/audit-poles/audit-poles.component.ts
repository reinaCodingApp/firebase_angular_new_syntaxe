import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AuditsService } from '../audit.service';
import { AuditPole } from '../models/audit-pole';
import { MatDialog } from '@angular/material';
import { AddPoleMemberComponent } from '../dialogs/add-pole-member/add-pole-member.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'audit-poles',
  templateUrl: './audit-poles.component.html',
  styleUrls: ['./audit-poles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuditPolesComponent implements OnInit, OnDestroy {
  poles: AuditPole[];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any>;

  constructor(
    private _router: Router,
    private auditsService: AuditsService,
    private matDialog: MatDialog
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.auditsService.onAuditPolesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(poles => {
        this.poles = poles;
        this.poles.concat([...poles, ...poles, ...poles, ...poles, ...poles]);
      });

    this.auditsService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  manageMembers(pole: AuditPole): void {
    this.dialogRef = this.matDialog.open(AddPoleMemberComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        pole: pole
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

