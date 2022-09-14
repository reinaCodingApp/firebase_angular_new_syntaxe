import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { PaginatedMissionOrders } from './models/paginatedMissionOrders';
import { Employee } from 'app/common/models/employee';
import { AppService } from 'app/app.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { MissionOrder } from './models/missionOrder';
import { MissionOrderCostType } from './models/missionOrderCostType';
import { MissionOrderViewModel } from './models/missionOrderViewModel';


@Injectable()
export class MissionOrderService implements Resolve<any>
{
  private GET_MISSION_ORDER_VIEWMODEL_URI = 'missionorder/index';
  private GET_MISSION_ORDERS_URI = 'missionorder/get';
  private ADD_MISSION_ORDER_URI = 'missionorder/add';
  private UPDATE_MISSION_ORDER_URI = 'missionorder/update';
  private CHANGE_MISSION_ORDER_STATE_URI = 'missionorder/change_state';

  onMissionOrdersChanged: BehaviorSubject<PaginatedMissionOrders>;
  onCurrentMissionOrderChanged: BehaviorSubject<MissionOrder>;
  onEmployeesChanged: BehaviorSubject<Employee[]>;
  onCostTypesChanged: BehaviorSubject<MissionOrderCostType[]>;

  filterParams: {
    employeeId: number;
    isInvoiced: number;
  };

  missionOrderstatus: any[];
  dayWorks: any[];

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.missionorder;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router
  ) {
    this.missionOrderstatus = EmbeddedDatabase.missionOrderstatus;
    this.dayWorks = EmbeddedDatabase.dayWorks;
    this.onMissionOrdersChanged = new BehaviorSubject(null);
    this.onCurrentMissionOrderChanged = new BehaviorSubject(null);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onCostTypesChanged = new BehaviorSubject([]);
    this.filterParams = {
      employeeId: 0,
      isInvoiced: 0
    };
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve(null);
              } else {
                this.getMissionOrderViewModel().then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  resolve(null);
                }, (err) => {
                  reject(err);
                });
              }
            }, (err) => {
              reject(err);
            });
        } else {
          this.router.navigate(['login']);
          resolve(null);
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  getMissionOrderViewModel(): Promise<MissionOrderViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_MISSION_ORDER_VIEWMODEL_URI}?start=0&length=20&isInvoiced=0`;
      this._httpClient.get<MissionOrderViewModel>(url).subscribe((missionOrderViewModel) => {
        const paginatedMissionOrders: PaginatedMissionOrders = {
          start: 0,
          total: missionOrderViewModel.missionOrdersTotal,
          missionOrders: missionOrderViewModel.missionOrders
        };
        this.onMissionOrdersChanged.next(paginatedMissionOrders);
        this.onEmployeesChanged.next(missionOrderViewModel.employees);
        this.onCostTypesChanged.next(missionOrderViewModel.missionOrderCostTypes);
        resolve(null);
      }, reject);
    });
  }

  getMissionOrders(employeeId: number, isInvoiced: number): Observable<PaginatedMissionOrders> {
    const start = 0;
    const length = 20;
    this.filterParams.employeeId = employeeId;
    this.filterParams.isInvoiced = isInvoiced;
    const url = `${BASE_URL}${this.GET_MISSION_ORDERS_URI}?start=${start}&length=${length}&isInvoiced=${this.filterParams.isInvoiced}&employeeId=${this.filterParams.employeeId}`;
    return this._httpClient.get<PaginatedMissionOrders>(url);
  }

  getMoreMissionOrders(start: number, length: number): Observable<PaginatedMissionOrders> {
    const url = `${BASE_URL}${this.GET_MISSION_ORDERS_URI}?start=${start}&length=${length}&isInvoiced=${this.filterParams.isInvoiced}&employeeId=${this.filterParams.employeeId}`;
    return this._httpClient.get<PaginatedMissionOrders>(url);
  }

  addMissionOrder(missionOrder: MissionOrder): Observable<any> {
    const url = `${BASE_URL}${this.ADD_MISSION_ORDER_URI}`;
    return this._httpClient.post<any>(url, missionOrder);
  }

  updateMissionOrder(missionOrder: MissionOrder): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_MISSION_ORDER_URI}`;
    return this._httpClient.post<any>(url, missionOrder);
  }

  changeState(missionOrderId: number, state: number): Observable<any> {
    const url = `${BASE_URL}${this.CHANGE_MISSION_ORDER_STATE_URI}?id=${missionOrderId}&state=${state}`;
    return this._httpClient.get<any>(url);
  }

  // Common Functions

  getTotalFrais(missionOrder: MissionOrder): string {
    let totalFrais = 0;
    missionOrder.costs.forEach(item => {
      totalFrais += item.cost;
    });
    return totalFrais.toFixed(2);
  }

  getTotalFraisPerso(missionOrder: MissionOrder): string {
    let totalFrais = 0;
    missionOrder.costs.forEach(item => {
      if (item.isPersonalCost) {
        totalFrais += item.cost;
      }
    });
    return totalFrais.toFixed(2);
  }

  getTotalIntervenants(missionOrder: MissionOrder): string {
    let totalIntervenants = 0;
    missionOrder.missionOrderEmployees.forEach(item => {
      totalIntervenants += item.daysWork * 70;
    });
    return totalIntervenants.toFixed(2);
  }

  getTotal(missionOrder: MissionOrder): string {
    let total = 0;
    total += Number(this.getTotalIntervenants(missionOrder));
    total += Number(this.getTotalFrais(missionOrder));
    return (total - missionOrder.rebate).toFixed(2);
  }
}
