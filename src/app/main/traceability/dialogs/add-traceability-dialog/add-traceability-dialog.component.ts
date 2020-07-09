import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Site } from 'app/common/models/site';
import { TraceabilityService } from '../../traceability.service';
import { ReferenceCode } from 'app/main/traceability/models/descending/referenceCode';
import { Traceability } from 'app/main/traceability/models/descending/traceability';
import { TraceabilityMaterial } from 'app/main/traceability/models/traceabilityMaterial';
import { TraceabilityItem } from 'app/main/traceability/models/descending/traceabilityItem';
import { TraceabilityPlanification } from 'app/main/traceability/models/descending/traceabilityPlanification';
import { RequestParameter } from 'app/main/traceability/models/descending/requestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { PaginationParameter } from '../../models/paginationParameter';

@Component({
  selector: 'app-add-traceability-dialog',
  templateUrl: './add-traceability-dialog.component.html',
  styleUrls: ['./add-traceability-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTraceabilityDialogComponent implements OnInit {
  traceabilityPlanification: TraceabilityPlanification;
  traceability: Traceability;
  sites: Site[];
  colors: string[];
  shapes: TraceabilityMaterial[];
  codes: ReferenceCode[] = [];
  mode: string;
  traceabilityItem: TraceabilityItem;
  ringTraceabilityItem: TraceabilityItem;
  alreadyExistedSites: Site[];

  editionMode: boolean;
  selectedTraceabilityItem: TraceabilityItem;
  habilitation: Habilitation = new Habilitation(0);

  total: number;
  paginationParameter: PaginationParameter;
  opened: boolean;
  searchInput = '';
  lastSearchInput = '';
  requestParameter: RequestParameter;

  constructor(
    public matDialogRef: MatDialogRef<AddTraceabilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _traceabilityService: TraceabilityService,
    private _notificationService: SharedNotificationService
  ) {
    this.mode = data.mode;
    this.traceabilityItem = new TraceabilityItem();
    this.ringTraceabilityItem = new TraceabilityItem();
    this.traceabilityPlanification = data.traceabilityPlanification;
    this.getAlreadyExistedSites();
    if (this.mode === 'edit') {
      this.traceability = data.traceability;
    } else {
      this.traceability = new Traceability();
    }
  }

  ngOnInit(): void {
    this._traceabilityService.onRequestParameterChanged.subscribe((requestParameter) => {
      this.requestParameter = requestParameter;
    });
    this._traceabilityService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
    });
    this._traceabilityService.onCodesChanged.subscribe((codes) => {
      this.codes = codes;
    });
    this._traceabilityService.onColorsChanged.subscribe((colors) => {
      this.colors = colors;
    });
    this._traceabilityService.onShapesChanged.subscribe((shapes) => {
      this.shapes = shapes;
    });
    this._traceabilityService.onDefaultShapeChanged.subscribe((defaultShape) => {
      if (defaultShape > 0) {
        this.traceabilityItem.material.id = defaultShape;
      }
    });
    this._traceabilityService.onLastSearchInputChanged.subscribe((lastSearchInput) => {
      this.lastSearchInput = lastSearchInput;
    });
    this._traceabilityService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
    this.initAvailableCodes();
  }

  addTraceability(): void {
    if (this.mode === 'new') {
      this.traceability.planificationId = this.traceabilityPlanification.id;
      this._traceabilityService.addTraceability(this.traceability)
        .subscribe((addedTraceability) => {
          if (addedTraceability) {
            this.traceability.id = addedTraceability.id;
            this.traceability.site = addedTraceability.site;
            this.mode = 'edit';
            this.refreshData(this.traceability);
          }
          this._notificationService.showSuccess('Traçabilité crée avec succés');
        }, (err) => {
          console.log(err);
          this._notificationService.showStandarError();
        });
    }
  }

  updateColorAndComment(): void {
    this.traceability.planificationId = this.traceabilityPlanification.id;
    this._traceabilityService.updateColorAndComment(this.traceability)
      .subscribe((uptadedTraceability) => {
        this.traceability.color = uptadedTraceability.color;
        this.traceability.description = uptadedTraceability.description;
        this.refreshData(this.traceability);
        // this.matDialogRef.close();
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  addTraceabilityItem(): void {
    this.traceabilityItem.traceabilityId = this.traceability.id;
    this._traceabilityService.addTraceabilityItem(this.traceabilityItem)
      .subscribe((addedTraceabilityItem) => {
        if (this.traceability.traceabilityItems == null) {
          this.traceability.traceabilityItems = [];
        }
        this.traceability.traceabilityItems.push(addedTraceabilityItem);
        this.refreshData(this.traceability);
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  updateTraceabilityItem(): void {
    const requestParameter: RequestParameter = {
      itemId: this.selectedTraceabilityItem.id,
      materialId: this.selectedTraceabilityItem.material.id
    };
    this._traceabilityService.updateItemMaterial(requestParameter)
      .subscribe((updatedTraceabilityItem) => {
        const index = this.traceability.traceabilityItems.findIndex(item => item.id === updatedTraceabilityItem.id);
        if (index >= 0) {
          this.traceability.traceabilityItems[index] = updatedTraceabilityItem;
        }
        this.refreshData(this.traceability);
        this.disableUpdateTraceabilityItemMode();
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  addRingTraceabilityItem(): void {
    this.ringTraceabilityItem.traceabilityId = this.traceability.id;
    this.ringTraceabilityItem.isRing = true;
    this.ringTraceabilityItem.material.id = 57;
    this._traceabilityService.addTraceabilityItem(this.ringTraceabilityItem)
      .subscribe((addedTraceabilityItem) => {
        this.ringTraceabilityItem.code.code = '';
        if (this.traceability.traceabilityItems == null) {
          this.traceability.traceabilityItems = [];
        }
        this.traceability.traceabilityItems.push(addedTraceabilityItem);
        this.refreshData(this.traceability);
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  deleteTraceabilityItem(traceabilityItem: TraceabilityItem): void {
    this._traceabilityService.deleteTraceabilityItem(traceabilityItem)
      .subscribe((response) => {
        if (response) {
          this.traceability.traceabilityItems = this.traceability.traceabilityItems
            .filter((item => item.id !== traceabilityItem.id));
          this.refreshData(this.traceability);
        }
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  siteAlreadyExist(site: Site): boolean {
    let result = false;
    if (site) {
      for (const existedSite of this.alreadyExistedSites) {
        if (existedSite.id === site.id) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  getAlreadyExistedSites(): Site[] {
    this.alreadyExistedSites = [];
    this.traceabilityPlanification.items.forEach(traceability => {
      this.alreadyExistedSites.push(traceability.site);
    });
    return this.alreadyExistedSites;
  }

  enableUpdateTraceabilityItemMode(traceabilityItem: TraceabilityItem): void {
    this.editionMode = true;
    this.selectedTraceabilityItem = JSON.parse(JSON.stringify(traceabilityItem));
  }

  disableUpdateTraceabilityItemMode(): void {
    this.editionMode = false;
    this.selectedTraceabilityItem = null;
  }

  checkEditionMode(traceabilityItem: TraceabilityItem): boolean {
    if (this.selectedTraceabilityItem !== null && this.editionMode) {
      if (this.selectedTraceabilityItem.id === traceabilityItem.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  refreshData(traceability: Traceability): void {
    if (this.traceabilityPlanification.items == null) {
      this.traceabilityPlanification.items = [];
    }
    const index = this.traceabilityPlanification.items.findIndex(item => item.id === traceability.id);
    if (index >= 0) {
      this.traceabilityPlanification.items[index] = traceability;
    } else {
      this.traceabilityPlanification.items.push(this.traceability);
    }
    const traceabilityPlanification = JSON.parse(JSON.stringify(this.traceabilityPlanification));
    this._traceabilityService.onTaceabilityPlanificationChanged.next(traceabilityPlanification);
  }

  getNextCodes(): void {
    this.paginationParameter.start += this.paginationParameter.length;
    this._traceabilityService.getAvailablesCodes(this.paginationParameter)
      .subscribe((result: any) => {
        this.codes.push(...result.data);
        this.total = result.total;
      }, err => {
        console.log(err);
      });
  }

  searchCode(searchInput: string): void {
    this.paginationParameter.start = 0;
    this.paginationParameter.searchInput = searchInput;
    this._traceabilityService.getAvailablesCodes(this.paginationParameter)
      .subscribe((result: any) => {
        if (this.opened) {
          this.codes = result.data;
          this.total = result.total;
        }
      }, err => {
        console.log(err);
      });
  }

  initAvailableCodes(): void {
    this.paginationParameter = {
      start: 0,
      searchInput: this.lastSearchInput,
      length: 50
    };
    this._traceabilityService.getAvailablesCodes(this.paginationParameter)
      .subscribe((result: any) => {
        this.codes = result.data;
        this.total = result.total;
      }, err => {
        console.log(err);
      });
  }

  openedChange(opened: boolean): void {
    this.opened = opened;
    if (!this.opened) {
      this.lastSearchInput = this.searchInput;
      this._traceabilityService.onLastSearchInputChanged.next(this.lastSearchInput);
    } else {
      this.searchInput = this.lastSearchInput;
      this.initAvailableCodes();
    }
  }

  addTraceabilityForPreviousWeekSites(): void {
    const requestParameter: RequestParameter = {
      week: this.requestParameter.week - 1,
      year: this.requestParameter.year,
    };
    this._traceabilityService.getTraceabilityPlanification(requestParameter)
      .subscribe((lastWeekTraceabilityPlanification) => {
        const lastWeekSites: Site[] = [];
        lastWeekTraceabilityPlanification.items.forEach(item => {
          lastWeekSites.push(item.site);
        });
        const traceabitlities = [];
        if (this.mode === 'new') {
          lastWeekSites.forEach(site => {
            if (!this.siteAlreadyExist(site)) {
              const traceability = {
                planificationId: this.traceabilityPlanification.id,
                site: { id: site.id }
              };
              traceabitlities.push(traceability);
            }
          });
          if (traceabitlities.length > 0) {
            this._traceabilityService.addTraceabilityForPreviousWeekSites(traceabitlities)
              .subscribe((insertedTraceabilities) => {
                if (this.traceabilityPlanification.items == null) {
                  this.traceabilityPlanification.items = [];
                }
                insertedTraceabilities.forEach(traceability => {
                  this.traceabilityPlanification.items.push(traceability);
                  const traceabilityPlanification = JSON.parse(JSON.stringify(this.traceabilityPlanification));
                  this._traceabilityService.onTaceabilityPlanificationChanged.next(traceabilityPlanification);
                });
                this._notificationService.showSuccess('Traçabilité crée avec succés');
                this.matDialogRef.close();
              }, (err) => {
                console.log(err);
                this._notificationService.showStandarError();
              });
          } else {
            this._notificationService.showWarning('Vous avez déjà créé des lignes de traçabilité pour tous les sites de la semaine précédente');
          }
        }
      }, (err) => {
        this._notificationService.showStandarError();
        console.log(err);
      });

  }

  updateDefaultShape(): void {
    if (this.traceabilityItem.material.id > 0) {
      this._traceabilityService.onDefaultShapeChanged.next(this.traceabilityItem.material.id);
    }
  }

}




