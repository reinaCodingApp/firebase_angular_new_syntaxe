import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Employee } from 'app/common/models/employee';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { MissionOrderService } from '../mission-order.service';

@Component({
  selector: 'mission-order-sidebar',
  templateUrl: './mission-order-sidebar.component.html'
})
export class MissionOrderSidebarComponent implements OnInit {
  missionOrderstatus: any[];
  employees: Employee[];
  filtredEmployees: Employee[];
  selectedStatus: number;
  employeeId: number;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _missionOrderService: MissionOrderService
    ) {
    this.missionOrderstatus = this._missionOrderService.missionOrderstatus;
    this.selectedStatus = 0;
    this.employeeId = 0;
  }

  ngOnInit(): void {
    this._missionOrderService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
      this.filtredEmployees = employees;
    });
    this._missionOrderService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getMissionOrders(): void {
    this._missionOrderService.getMissionOrders(this.employeeId, this.selectedStatus)
      .subscribe((paginatedMissionOrders) => {
        this._missionOrderService.onMissionOrdersChanged.next(paginatedMissionOrders);
        this._missionOrderService.onCurrentMissionOrderChanged.next(null);
      }, (err) => {
        console.log(err);
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
