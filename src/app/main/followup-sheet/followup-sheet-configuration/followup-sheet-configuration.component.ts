import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FollowupSheetService } from '../followup-sheet.service';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { MatDialog, Sort } from '@angular/material';
import { AddEmployeelevelDialogComponent } from './dialogs/add-employeelevel-dialog/add-employeelevel-dialog.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

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
  includeDisabledEmployeeLevels: boolean;

  constructor(
    private followupSheetService: FollowupSheetService,
    private matDialog: MatDialog,
    private loaderService: NgxUiLoaderService) {
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

  getEmployeeLevels(): void {
    this.loaderService.start();
    this.followupSheetService.getEmployeesLevels(this.includeDisabledEmployeeLevels)
      .then(() => {
        this.loaderService.stop();
      }).catch((err) => {
        this.loaderService.stop();
        console.log(err);
      });
  }

  sortEmployeeLevels(sort: Sort): void {
    const data = this.employeesLevels.slice();
    this.employeesLevels = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'employeeLevel': return this.compare(a.employee.fullName, b.employee.fullName, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  deactivateEmployeeLevel(employeeLevel: EmployeeLevel): void {
    this.dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Désactiver employé',
        message: 'Voulez-vous désactiver cet employé ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.followupSheetService.deactivateEmployeeLevel(employeeLevel).subscribe((result) => {
            if (result) {
              employeeLevel.isActive = false;
              const index = this.employeesLevels.findIndex(e => e.id === employeeLevel.id);
              if (index > -1) {
                this.employeesLevels[index] = employeeLevel;
                if (!this.includeDisabledEmployeeLevels) {
                  this.employeesLevels.splice(index, 1);
                }
                this.followupSheetService.onEmployeeLevelsChanged.next(JSON.parse(JSON.stringify(this.employeesLevels)));
              }
            }
            console.log(result);
          }, (err) => {
            console.log(err);
          });
        }
      });
  }

  activateEmployeeLevel(employeeLevel: EmployeeLevel): void {
    this.dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Activer employé',
        message: 'Voulez-vous activer cet employé ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.followupSheetService.activateEmployeeLevel(employeeLevel).subscribe((result) => {
            if (result) {
              employeeLevel.isActive = true;
              const index = this.employeesLevels.findIndex(e => e.id === employeeLevel.id);
              if (index > -1) {
                this.employeesLevels[index] = employeeLevel;
                this.followupSheetService.onEmployeeLevelsChanged.next(JSON.parse(JSON.stringify(this.employeesLevels)));
              }
            }
            console.log(result);
          }, (err) => {
            console.log(err);
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}

