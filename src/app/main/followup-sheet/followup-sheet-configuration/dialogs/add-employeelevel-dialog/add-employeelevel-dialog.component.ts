import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { FollowupSheetService } from 'app/main/followup-sheet/followup-sheet.service';
import { Employee } from 'app/common/models/employee';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';

@Component({
  selector: 'app-add-employeelevel-dialog',
  templateUrl: './add-employeelevel-dialog.component.html',
  styleUrls: ['./add-employeelevel-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddEmployeelevelDialogComponent implements OnInit {
  employees: Employee[];
  filtredEmployees: Employee[];
  responsibles: Employee[];
  filtredResponsibles: Employee[];
  employeesLevels: EmployeeLevel[];
  employeeLevel: EmployeeLevel;
  hierarchyLevels: any[];

  constructor(
    public matDialogRef: MatDialogRef<AddEmployeelevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _followupSheetService: FollowupSheetService,
    private _notificationService: SharedNotificationService
  ) {
    if (data.mode === 'edit') {
      this.employeeLevel = data.employeeLevel;
    } else {
      this.employeeLevel = new EmployeeLevel();
    }

  }

  ngOnInit(): void {
    this.hierarchyLevels = [...EmbeddedDatabase.hierarchyLevels];
    this._followupSheetService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
      this.filtredEmployees = employees;
    });
    this._followupSheetService.onResponsiblesChanged.subscribe((responsibles) => {
      this.responsibles = responsibles;
      this.filtredResponsibles = responsibles;
    });
    this._followupSheetService.onEmployeeLevelsChanged.subscribe((employeesLevels) => {
      this.employeesLevels = employeesLevels;
    });
  }

  addEmployeeLevel(): void {
    if (this.employeeAlreadyExist()) {
      this._notificationService.showWarning('Cet employé déja existe!');
      return;
    }
    if (this.checkResponsibleHierarchyLevel()) {
      this._notificationService.showWarning(`Le responsable d'un salarié de niveau 2 ne peut être que de niveau 3`);
      return;
    }
    if (this.employeeLevel.sectionDefaultTitle.trim().length > 3) {
      this._loaderService.start();
      this._followupSheetService.addEmployeeLevel(this.employeeLevel)
        .subscribe((createdEmployeeLevelId) => {
          this._loaderService.stop();
          this.matDialogRef.close();
          const employee = this.employees.find(e => {
            return e.id === this.employeeLevel.employee.id;
          });
          const responsible = this.responsibles.find(e => {
            return e.id === this.employeeLevel.responsible.id;
          });
          this.employeeLevel.id = createdEmployeeLevelId;
          this.employeeLevel.employee = employee;
          this.employeeLevel.responsible = responsible;
          this.employeesLevels.push(this.employeeLevel);
          this._followupSheetService.onEmployeeLevelsChanged.next(JSON.parse(JSON.stringify(this.employeesLevels)));
          this._notificationService.showSuccess('Ajout terminé avec succès');
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  updateEmployeeLevel(): void {
    if (this.checkResponsibleHierarchyLevel()) {
      this._notificationService.showWarning(`Le responsable d'un salarié de niveau 2 ne peut être que de niveau 3`);
      return;
    }
    this._loaderService.start();
    this._followupSheetService.updateEmployeeLevel(this.employeeLevel)
      .subscribe((response) => {
        if (response) {
          this._loaderService.stop();
          this.matDialogRef.close();
          this._notificationService.showSuccess('Modification terminé avec succès');
          const foundIndex = this.employeesLevels.findIndex(x => x.id === this.employeeLevel.id);
          const employee = this.employees.find(e => {
            return e.id === this.employeeLevel.employee.id;
          });
          const responsible = this.responsibles.find(e => {
            return e.id === this.employeeLevel.responsible.id;
          });
          this.employeesLevels[foundIndex] = this.employeeLevel;
          this.employeesLevels[foundIndex].employee = employee;
          this.employeesLevels[foundIndex].responsible = responsible;
          this._followupSheetService.onEmployeeLevelsChanged.next(JSON.parse(JSON.stringify(this.employeesLevels)));
        } else {
          this._notificationService.showStandarError();
        }
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateEmployeeLevel();
      } else {
        this.addEmployeeLevel();
      }
    }
  }

  employeeAlreadyExist(): boolean {
    const employee = this.employeesLevels.find(e => {
      return e.employee.id === this.employeeLevel.employee.id;
    });
    return employee !== undefined;
  }

  disableSubmitButton(): boolean {
    const employee = this.responsibles.find(r => {
      return r.id === this.employeeLevel.employee.id;
    });
    return (this.employeeLevel.hierarchyLevel > 1 && employee === undefined);
  }

  checkResponsibleHierarchyLevel(): boolean {
    const responsibleEmployeeLevel = this.employeesLevels.find(r => {
      return r.employee.id === this.employeeLevel.responsible.id;
    });
    return this.employeeLevel.hierarchyLevel === 2 && responsibleEmployeeLevel.hierarchyLevel < 3;
  }


  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

  searchResponsible(searchInput): void {
    if (!this.responsibles) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredResponsibles = this.responsibles.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

}



