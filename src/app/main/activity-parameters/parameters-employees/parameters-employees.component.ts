
import { Component, OnInit } from '@angular/core';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { ActivityParametersService } from '../activity-parameters.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'parameters-employees',
  templateUrl: './parameters-employees.component.html',
  styleUrls: ['./parameters-employees.component.scss']
})
export class ParametersEmployeesComponent implements OnInit {
  employees: CompleteEmployee[];
  filtredEmployees: CompleteEmployee[];

  selectedEmployee: CompleteEmployee;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _activityParamatersService: ActivityParametersService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService) {

    this._activityParamatersService.onEmployeesWithDepartmentsChanged.subscribe((employeesWitchDepartments) => {
      this.employees = employeesWitchDepartments.employees;
      this.filtredEmployees = employeesWitchDepartments.employees;
    });
  }

  ngOnInit(): void {
    this._activityParamatersService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  excludeEpmloyeeFromOvertimeComputing(): void {
    this._loaderService.start();
    const employee: any = {
      id: this.selectedEmployee.id,
      excludeFromPlusAndOverComputeTime: this.selectedEmployee.excludeFromPlusAndOverComputeTime
    };
    this._activityParamatersService.excludeEpmloyeeFromOvertimeComputing(employee)
      .subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          this._notificationService.showSuccess('Opération terminée avec succès');
        } else {
          this._notificationService.showStandarError();
        }
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
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

