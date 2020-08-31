import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceSalaryService } from './advance-salary.service';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AddAdvanceSalaryDialogComponent } from './dialogs/add-advance-salary-dialog/add-advance-salary-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-advance-salary',
  templateUrl: './advance-salary.component.html',
  styleUrls: ['./advance-salary.component.scss'],
  animations: fuseAnimations
})
export class AdvanceSalaryComponent implements OnInit, OnDestroy {
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _advanceSalaryService: AdvanceSalaryService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._advanceSalaryService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }


  addAdvanceSalary(): void {
    this.dialogRef = this._matDialog.open(AddAdvanceSalaryDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
