import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Department } from 'app/common/models/department';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { FormControl, NgForm } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ActivityParametersService } from '../activity-parameters.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { DepartmentsSetter } from 'app/main/activity-parameters/models/departmentsSetter';
import { Employee } from 'app/common/models/employee';
import { EmployeePreference } from 'app/main/activity-parameters/models/employeePreference';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'parameters-settings',
  templateUrl: './parameters-settings.component.html',
  styleUrls: ['./parameters-settings.component.scss']
})
export class ParametersSettingsComponent implements OnInit {
  departments: Department[];
  employees: CompleteEmployee[];
  filtredEmployees: CompleteEmployee[];
  employeesPreferences: EmployeePreference[];

  selectedEmployee: CompleteEmployee;
  defaultDepartment: Department;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  departmentCtrl = new FormControl();
  filteredDepartments: Observable<any[]>;
  selectedDepartments: any[] = [];
  allDepartments: any[];
  habilitation: Habilitation = new Habilitation(0);

  @ViewChild('departmentInput', { static: false }) departmentInput: ElementRef;

  constructor(
    private _activityParamatersService: ActivityParametersService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService) {

    this._activityParamatersService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = this.allDepartments = departments;
      this.filteredDepartments = this.departmentCtrl.valueChanges.pipe(
        startWith(null),
        map((department: string | null) => department ? this._filter(department) : this.allDepartments.slice()));
    });
    this._activityParamatersService.onEmployeesWithDepartmentsChanged.subscribe((employeesWitchDepartments) => {
      this.employees = employeesWitchDepartments.employees;
      this.filtredEmployees = employeesWitchDepartments.employees;
      this.employeesPreferences = employeesWitchDepartments.preferences;
    });
  }

  ngOnInit(): void {
    this._activityParamatersService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
      if (!this.habilitation.isAdmin()) {
        this.allDepartments = [];
        this.removable = false;
      }
    });
  }

  remove(indx: number): void {
    this.selectedDepartments.splice(indx, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selecteDepartment = event.option.value;
    const index = this.selectedDepartments.findIndex(d => d.id === selecteDepartment.id);
    if (index === -1) {
      this.selectedDepartments.push(selecteDepartment);
    }
    this.departmentInput.nativeElement.value = '';
    this.departmentCtrl.setValue(null);
  }

  private _filter(value: any): string[] {
    return this.allDepartments.filter(department => department.id === value.id);
  }

  selectedEmployeeChanged(): void {
    this.selectedDepartments = this.selectedEmployee.departments;
    this.defaultDepartment = this.getDefaultDepartmentForEmployee(this.selectedEmployee.id);
  }

  updateEmployeeDepartments(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      const departmentsIds: number[] = [];
      this.selectedDepartments.forEach(department => {
        departmentsIds.push(department.id);
      });
      const departmentsSetter: DepartmentsSetter = {
        employeeId: this.selectedEmployee.id,
        departmentsIds: departmentsIds,
        defaultDepartment: this.defaultDepartment.id
      };
      this._activityParamatersService.updateEmployeeDepartments(departmentsSetter).subscribe((response) => {
        this.refreshEmployeeWithDepartments(departmentsSetter);
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
    }
  }

  getDefaultDepartmentForEmployee(employeeId: number): Department {
    const employeePreference = this.employeesPreferences.filter(e => e.employeeId === employeeId);
    const defaultDepartment = this.selectedDepartments.filter(d => d.id === employeePreference[0].defaultDepartmentId);
    return defaultDepartment[0];
  }

  refreshEmployeeWithDepartments(departmentsSetter: DepartmentsSetter): void {
    this._activityParamatersService.getEmployeesWithDepartments()
      .then(() => {
        this._loaderService.stop();
        this.selectedEmployee = this.employees.filter(e => e.id === departmentsSetter.employeeId)[0];
        this.getDefaultDepartmentForEmployee(this.selectedEmployee.id);
        this._notificationService.showSuccess('opération terminée avec succés');
      });
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

}
