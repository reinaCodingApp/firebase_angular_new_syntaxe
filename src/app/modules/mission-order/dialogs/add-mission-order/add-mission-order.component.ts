import { AppService } from 'app/app.service';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MissionOrderService } from '../../mission-order.service';
import { Site } from 'app/common/models/site';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginatedMissionOrders } from '../../models/paginatedMissionOrders';
import { Employee } from 'app/common/models/employee';
import { MissionOrder } from '../../models/missionOrder';
import { MissionOrderClient } from '../../models/missionOrderClient';
import { MissionOrderCost } from '../../models/missionOrderCost';
import { MissionOrderCostType } from '../../models/missionOrderCostType';
import { MissionOrderEmployee } from '../../models/missionOrderEmployee';

@Component({
  selector: 'app-add-mission-order',
  templateUrl: './add-mission-order.component.html'
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
    this.unsubscribeAll.next(null);
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

  onSubmit(form: NgForm, isDraft: boolean): void {
    if (form.valid) {
      if (this.data.mode === 'new') {
        this.addMissionOrder(isDraft);
      } else {
        this.updateMissionOrder(isDraft);
      }
    }
  }

  addMissionOrder(isDraft: boolean): void {
    console.log('### call addMissionOrder from component');
    const missionOrder = JSON.parse(JSON.stringify(this.newMissionOrder));
    missionOrder.isDraft = isDraft;
    missionOrder.missionStart = moment(missionOrder.missionStart).format('MM/DD/YYYY');
    missionOrder.missionEnd = moment(missionOrder.missionEnd).format('MM/DD/YYYY');
    missionOrder.owner.id = this.connectedEmployeeId;
    missionOrder.missionOrderEmployees.forEach(element => {
      element.start = moment(element.start).format('MM/DD/YYYY');
      element.end = moment(element.start).format('MM/DD/YYYY');
    });
    this._missionOrderService.addMissionOrder(missionOrder)
      .pipe(take(1))
      .subscribe((createdMissionOrder) => {
        this.matDialogRef.close();
        this.paginatedMissionOrders.missionOrders.unshift(createdMissionOrder);
        this._missionOrderService.onMissionOrdersChanged.next(JSON.parse(JSON.stringify(this.paginatedMissionOrders)));
        this._notificationService.showSuccess(`Ordre de mission créé avec succès`);
      }, (err) => {
        this._notificationService.showStandarError();
      });
  }

  updateMissionOrder(isDraft: boolean): void {
    const missionOrder = JSON.parse(JSON.stringify(this.newMissionOrder));
    missionOrder.isDraft = isDraft;
    missionOrder.missionStart = moment(missionOrder.missionStart).format('MM/DD/YYYY');
    missionOrder.missionEnd = moment(missionOrder.missionEnd).format('MM/DD/YYYY');
    this._missionOrderService.updateMissionOrder(missionOrder)
      .pipe(take(1))
      .subscribe(() => {
        this.matDialogRef.close();
        this._notificationService.showSuccess(`Ordre de mission modifié avec succés`);
        const missionOrderIndex = this.paginatedMissionOrders.missionOrders.findIndex(m => m.id === missionOrder.id);
        if (missionOrderIndex > -1) {
          this.paginatedMissionOrders.missionOrders[missionOrderIndex] = this.newMissionOrder;
        }
        this._missionOrderService.onCurrentMissionOrderChanged.next(this.newMissionOrder);
      }, (err) => {
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

  addMissionOrderEmployee(): void {
    const isValid = (this.missionOrderEmployee && this.missionOrderEmployee.employee
      && this.missionOrderEmployee && this.missionOrderEmployee.start
      && this.missionOrderEmployee && this.missionOrderEmployee.end
      && this.missionOrderEmployee && this.missionOrderEmployee.daysWork != null && this.missionOrderEmployee.daysWork !== undefined);
    const newMissionOrderEmployee = { ...this.missionOrderEmployee };
    if (isValid) {
      this.newMissionOrder.missionOrderEmployees.push(newMissionOrderEmployee);
    } else {
      this._notificationService.showWarning('Veuillez renseigner tous les champs !');
    }
  }

  removeMissionOrderEmployee(missionOrderEmployeeIndex: number): void {
    this.newMissionOrder.missionOrderEmployees.splice(missionOrderEmployeeIndex, 1);
  }

  addMissionOrderCost(form: NgForm): void {
    const isValid = (this.missionOrderCost && this.missionOrderCost.costType
                    && this.missionOrderCost && this.missionOrderCost.cost > 0);
    if (isValid) {
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
    } else {
      this._notificationService.showWarning('Veuillez renseigner tous les champs !');
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
