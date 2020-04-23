import { AppService } from 'app/app.service';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MissionOrderService } from '../../mission-order.service';
import { Employee } from 'app/main/ticket/models/employee';
import { MissionOrder } from 'app/main/mission-order/models/missionOrder';
import { MissionOrderClient } from 'app/main/mission-order/models/missionOrderClient';
import { Site } from 'app/common/models/site';
import { MissionOrderEmployee } from 'app/main/mission-order/models/missionOrderEmployee';
import { MissionOrderCost } from 'app/main/mission-order/models/missionOrderCost';
import { MissionOrderCostType } from 'app/main/mission-order/models/missionOrderCostType';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LoginService } from 'app/main/login/login.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginatedMissionOrders } from '../../models/paginatedMissionOrders';

@Component({
  selector: 'app-add-mission-order',
  templateUrl: './add-mission-order.component.html',
  styleUrls: ['./add-mission-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddMissionOrderComponent implements OnInit, OnDestroy {
  newMissionOrder: MissionOrder;
  employees: Employee[];
  filtredEmployees: Employee[];
  costsTypes: MissionOrderCostType[];
  clientName: string;
  siteName: string;
  missionOrderEmployee: MissionOrderEmployee;
  missionOrderCost: MissionOrderCost;
  dayWorks: any[];
  clientIndex: number;
  smallScreen: boolean;
  connectedEmployeeId: number;
  paginatedMissionOrders: PaginatedMissionOrders;
  unsubscribeAll = new Subject<any>();

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '21rem',
    minHeight: '5rem',
    placeholder: 'Rapport',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    sanitize: true,
    defaultFontName: 'Raleway',
    fonts: [
      { class: 'raleway', name: 'Raleway' }
    ],
    toolbarHiddenButtons: [
      ['backgroundColor', 'insertVideo', 'insertImage']
    ],
  };

  constructor(
    public matDialogRef: MatDialogRef<AddMissionOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _missionOrderService: MissionOrderService,
    private _notificationService: SharedNotificationService,
    private appService: AppService,
    private breakpointObserver: BreakpointObserver
  ) {
    if (this.data.mode === 'edit') {
      this.newMissionOrder = this.data.missionOrder;
    } else {
      this.newMissionOrder = new MissionOrder();
    }
    this.missionOrderEmployee = new MissionOrderEmployee();
    this.missionOrderCost = new MissionOrderCost();
    this.dayWorks = this._missionOrderService.dayWorks;
    this.clientName = '';
    this.siteName = '';
    this.connectedEmployeeId = appService.currentUser.customClaims.employeeId;
  }
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this._missionOrderService.onMissionOrdersChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((paginatedMissionOrders) => {
        this.paginatedMissionOrders = paginatedMissionOrders;
      });
    this._missionOrderService.onEmployeesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((employees) => {
        this.employees = employees;
        this.filtredEmployees = employees;
      });
    this._missionOrderService.onCostTypesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((costs) => {
        this.costsTypes = costs;
      });
    this.breakpointObserver
      .observe(['(min-width: 872px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = false;
        } else {
          this.smallScreen = true;
        }
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'new') {
        this.addMissionOrder();
      } else {
        this.updateMissionOrder();
      }
    }
  }

  addMissionOrder(): void {
    console.log('### call addMissionOrder from component');
    const missionOrder = JSON.parse(JSON.stringify(this.newMissionOrder));
    missionOrder.missionStart = moment(missionOrder.missionStart).format('MM/DD/YYYY');
    missionOrder.missionEnd = moment(missionOrder.missionEnd).format('MM/DD/YYYY');
    missionOrder.owner.id = this.connectedEmployeeId;
    missionOrder.missionOrderEmployees.forEach(element => {
      element.start = moment(element.start).format('MM/DD/YYYY');
      element.end = moment(element.start).format('MM/DD/YYYY');
    });
    this._loaderService.start();
    this._missionOrderService.addMissionOrder(missionOrder)
      .pipe(take(1))
      .subscribe((createdMissionOrder) => {
        this._loaderService.stop();
        this.matDialogRef.close();
        this.paginatedMissionOrders.missionOrders.unshift(createdMissionOrder);
        this._missionOrderService.onMissionOrdersChanged.next(JSON.parse(JSON.stringify(this.paginatedMissionOrders)));
        this._notificationService.showSuccess(`Ordre de mission créé avec succès`);
      }, (err) => {
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  updateMissionOrder(): void {
    const missionOrder = JSON.parse(JSON.stringify(this.newMissionOrder));
    missionOrder.missionStart = moment(missionOrder.missionStart).format('MM/DD/YYYY');
    missionOrder.missionEnd = moment(missionOrder.missionEnd).format('MM/DD/YYYY');
    this._loaderService.start();
    this._missionOrderService.updateMissionOrder(missionOrder)
      .pipe(take(1))
      .subscribe(() => {
        this._loaderService.stop();
        this.matDialogRef.close();
        this._notificationService.showSuccess(`Ordre de mission modifié avec succés`);
        const missionOrderIndex = this.paginatedMissionOrders.missionOrders.findIndex(m => m.id === missionOrder.id);
        if (missionOrderIndex > -1) {
          this.paginatedMissionOrders.missionOrders[missionOrderIndex] = this.newMissionOrder;
        }
        this._missionOrderService.onCurrentMissionOrderChanged.next(this.newMissionOrder);
      }, (err) => {
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  addClient(): void {
    if (this.clientName.length <= 3) {
      this._notificationService.showWarning('Merci de saisir un nom de client à plus de trois caractères !');
    } else {
      let client = new MissionOrderClient();
      client.name = this.clientName;
      this.newMissionOrder.clients.push(client);
      this.clientName = '';
      this.clientIndex = this.newMissionOrder.clients.indexOf(client);
    }
  }

  removeClient(index: number): void {
    this.newMissionOrder.clients.splice(index, 1);
  }

  addSite(index: number): void {
    if (this.siteName.length <= 3) {
      this._notificationService.showWarning('Merci de saisir un nom de site à plus de trois caractères !');
    } else {
      let site = new Site();
      site.name = this.siteName;
      this.newMissionOrder.clients[index].sites.push(site);
      this.siteName = '';
    }
  }

  removeSite(clientIndex: number, siteIndex: number): void {
    this.newMissionOrder.clients[clientIndex].sites.splice(siteIndex, 1);
  }

  addMissionOrderEmployee(form: NgForm): void {
    const newMissionOrderEmployee = { ...this.missionOrderEmployee };
    if (form.valid) {
      this.newMissionOrder.missionOrderEmployees.push(newMissionOrderEmployee);
    }
  }

  removeMissionOrderEmployee(missionOrderEmployeeIndex: number): void {
    this.newMissionOrder.missionOrderEmployees.splice(missionOrderEmployeeIndex, 1);
  }

  addMissionOrderCost(form: NgForm): void {
    if (form.valid && this.missionOrderCost.cost > 0) {
      const cost = this.newMissionOrder.costs
        .find((c) => {
          return c.costType.id === this.missionOrderCost.costType.id;
        });
      if (!cost) {
        this.newMissionOrder.costs.push(this.missionOrderCost);
        this.missionOrderCost = new MissionOrderCost();
      } else {
        const index = this.newMissionOrder.costs.indexOf(cost);
        this.newMissionOrder.costs[index].cost += this.missionOrderCost.cost;
      }
    }
  }

  checkCost(): void {
    this.missionOrderCost.cost = Math.abs(this.missionOrderCost.cost);
  }

  removeMissionOrderCost(costIndex: number): void {
    this.newMissionOrder.costs.splice(costIndex, 1);
  }

  getTotalFrais(): string {
    return this._missionOrderService.getTotalFrais(this.newMissionOrder);
  }

  getTotalFraisPerso(): string {
    return this._missionOrderService.getTotalFraisPerso(this.newMissionOrder);
  }

  getTotalIntervenants(): string {
    return this._missionOrderService.getTotalIntervenants(this.newMissionOrder);
  }

  getTotal(): string {
    return this._missionOrderService.getTotal(this.newMissionOrder);
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

  checkRebate(): void {
    this.newMissionOrder.rebate = Math.abs(this.newMissionOrder.rebate);
    let total = 0;
    total += Number(this.getTotalIntervenants());
    total += Number(this.getTotalFrais());
    if (this.newMissionOrder.rebate > total) {
      this.newMissionOrder.rebate = 0;
    }
  }

}
