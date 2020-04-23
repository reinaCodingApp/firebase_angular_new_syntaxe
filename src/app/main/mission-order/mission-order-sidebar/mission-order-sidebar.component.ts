import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Employee } from 'app/common/models/employee';
import { MissionOrderService } from '../mission-order.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'mission-order-sidebar',
  templateUrl: './mission-order-sidebar.component.html',
  styleUrls: ['./mission-order-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MissionOrderSidebarComponent implements OnInit {
  missionOrderstatus: any[];
  employees: Employee[];
  filtredEmployees: Employee[];
  selectedStatus: number;
  employeeId: number;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _missionOrderService: MissionOrderService,
    private _loaderService: NgxUiLoaderService
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
    this._loaderService.start();
    this._missionOrderService.getMissionOrders(this.employeeId, this.selectedStatus)
      .subscribe((paginatedMissionOrders) => {
        this._loaderService.stop();
        this._missionOrderService.onMissionOrdersChanged.next(paginatedMissionOrders);
        this._missionOrderService.onCurrentMissionOrderChanged.next(null);
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
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
