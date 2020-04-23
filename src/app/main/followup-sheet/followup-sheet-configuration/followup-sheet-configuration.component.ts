import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FollowupSheetService } from '../followup-sheet.service';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { MatDialog } from '@angular/material';
import { AddEmployeelevelDialogComponent } from './dialogs/add-employeelevel-dialog/add-employeelevel-dialog.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'app-followup-sheet-configuration',
  templateUrl: './followup-sheet-configuration.component.html',
  styleUrls: ['./followup-sheet-configuration.component.scss'],
  animations: fuseAnimations
})
export class FollowupSheetConfigurationComponent implements OnInit, OnDestroy {

  employeesLevels: EmployeeLevel[] = [];
  displayColumns = ['employee', 'responsible', 'hierarchyLevel', 'sectionDefaultTitle', 'actions'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private followupSheetService: FollowupSheetService,
    private matDialog: MatDialog) {
  }
  ngOnInit(): void {
    this.followupSheetService.onEmployeeLevelsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(employeesLevels => {
        this.employeesLevels = [...employeesLevels];
      });
    this.followupSheetService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  addEmployeeLevel(): void {
    this.dialogRef = this.matDialog.open(AddEmployeelevelDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  updateEmployeeLevel(currentEmployeeLevel: EmployeeLevel): void {
    const employeeLevel = JSON.parse(JSON.stringify(currentEmployeeLevel));
    this.dialogRef = this.matDialog.open(AddEmployeelevelDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        employeeLevel: employeeLevel
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}

