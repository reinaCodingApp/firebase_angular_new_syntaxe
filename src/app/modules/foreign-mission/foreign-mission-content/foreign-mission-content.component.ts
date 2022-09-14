import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForeignMissionService } from '../foreign-mission.service';
import { AddForeignMissionDialogComponent } from '../dialogs/add-foreign-mission-dialog/add-foreign-mission-dialog.component';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { ForeignMissionActivity } from '../models/foreignMissionActivity';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ForeignMissionComponent } from '../foreign-mission.component';
import { MatDrawer } from '@angular/material/sidenav';


@Component({
  selector: 'foreign-mission-content',
  templateUrl: './foreign-mission-content.component.html'
})
export class ForeignMissionContentComponent implements OnInit {
  @ViewChild(MatSort , {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  @ViewChild('drawer') drawer: MatDrawer;
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  smallScreen: boolean;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['employee.fullName', 'site.name', 'departingDate', 'returningDate',
  'actions'];
  constructor(
    public _matDialog: MatDialog,
    public foreignMissionComponent: ForeignMissionComponent,

    private _foreignMissionService: ForeignMissionService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.loadingIndicator = true;
    this.reorderable = true;
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Nombre d'éléments par page";

    this._foreignMissionService.onForeignMissionsChanged
      .subscribe(foreignMissions => {
        this.rows = [...foreignMissions];
        console.log('### rows', this.rows);
        this.dataSource = new MatTableDataSource(this.rows);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'employee.fullName': return item.employee.fullName;
            case 'site.name': return item.site.name;
            default: return item[property];
          }
        };
        this.dataSource.paginator = this.paginator;

        this.loadingIndicator = false;
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
    this._foreignMissionService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }
  addForeignMission(): void {
    this.dialogRef = this._matDialog.open(AddForeignMissionDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'add'
            }
    });
    this.dialogRef.afterClosed()
      .subscribe(() => {
      });
  }

  updateForeignMission(row: ForeignMissionActivity): void {
    const currentForeignMission = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(AddForeignMissionDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        foreignMission: currentForeignMission
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(() => {
      });
  }

  deleteForeignMission(foreinMission: ForeignMissionActivity): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression mission',
        message: 'Etes-vous sûr de vouloir de supprimer cette mission ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        } else {
          
          this._foreignMissionService.deleteForeignMission(foreinMission.id).subscribe((result) => {
            if (result){
              const deletedAdvanceSalaryIndex = this.rows.findIndex(x => x.id === foreinMission.id);
              this.rows.splice(deletedAdvanceSalaryIndex, 1);
              this._foreignMissionService.onForeignMissionsChanged.next(JSON.parse(JSON.stringify(this.rows)));
            }
          }, (err) => {
            console.log(err);
          });
        }
      });
  }

}

