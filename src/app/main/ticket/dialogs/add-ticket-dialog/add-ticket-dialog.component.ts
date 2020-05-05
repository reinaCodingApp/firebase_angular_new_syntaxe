import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TicketService } from '../../ticket.service';
import { NgForm } from '@angular/forms';
import { Ticket } from 'app/main/ticket/models/ticket';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { TicketViewModel } from '../../models/ticketViewModel';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UsersService } from 'app/main/settings/users/users.service';
import { AppService } from 'app/app.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';

@Component({
  selector: 'app-add-ticket-dialog',
  templateUrl: './add-ticket-dialog.component.html',
  styleUrls: ['./add-ticket-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTicketDialogComponent implements OnInit {
  isBackofficeMember: boolean;
  services: any[];
  emergencyLevels: any[];
  newTicket: Ticket;
  currentDepartmentId: number;
  filesToUpload = [];
  ticketViewModel: TicketViewModel;
  private moduleIdentifier = ModuleIdentifiers.ticket;

  constructor(
    public matDialogRef: MatDialogRef<AddTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _ticketService: TicketService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService,
    private usersService: UsersService,
    private router: Router,
    private appService: AppService
  ) {
    this.appService.onCurentUserChanged.subscribe(user => {
      if (user) {
        this.appService.getHabilitation(user, this.moduleIdentifier).then(habilitation => {
          this.isBackofficeMember = habilitation.isAdmin();
        });
      }
    });
    this.newTicket = new Ticket();
    this.emergencyLevels = [
      { id: 1, title: 'Moyenne (1 semaine)' },
      { id: 2, title: 'Haute (3 jours)' },
      { id: 3, title: 'Urgent (24 heures)' }
    ];
  }

  ngOnInit(): void {
    this._ticketService.onTicketViewModelChanged.subscribe((ticketViewModel) => {
      if (ticketViewModel) {
        this.ticketViewModel = ticketViewModel;
        this.services = ticketViewModel.vm.services;
        this.currentDepartmentId = ticketViewModel.vm.currentDepartment.id;
      } else {
        this.currentDepartmentId = 1;
        this._ticketService.getServices().subscribe(services => {
          this.services = services;
        });
      }
    });
  }

  addTicket(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this.newTicket.departmentId = this.currentDepartmentId;
      this.newTicket.hasAttachments = (this.filesToUpload != null && this.filesToUpload.length > 0);
      this.newTicket.fromBackOffice = this.isBackofficeMember;
      this._ticketService.addTicket(this.newTicket)
        .pipe(take(1))
        .subscribe((ticketId) => {
          if (ticketId) {
            if (this.newTicket.hasAttachments) {
              this._ticketService.uploadFiles(ticketId, null, this.filesToUpload)
                .subscribe((result) => {
                  this.redirectUser();
                });
            } else {
              this.redirectUser();
            }
          }
        });
    }
  }

  preview(files): void {
    if (files.length === 0) {
      return;
    }
    if (files.length > 10) {
      this._notificationService.showWarning(`Il n'est pas possible de joindre plus de 10 fichier`);
      return;
    }
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file.size / 1024 > this._ticketService.maxFileSize) {
        this._notificationService.showWarning(`La taille du fichier ne doit pas dépasser (${this._ticketService.maxFileSize / 1024}) Mo`);
        continue;
      }
      if (this.filesToUpload.length >= 10) {
        this._notificationService.showWarning(`Il est possible de joindre 10 fichiers maximum par demande, vous dépassez cette limite`);
        return;
      }
      this.filesToUpload.push(file);
    }
  }

  removeFile(file): void {
    const index = this.filesToUpload.indexOf(file);
    this.filesToUpload.splice(index, 1);
  }

  redirectUser(): void {
    this._loaderService.stop();
    if (this.router.url.indexOf('admin-tickets') !== -1) {
      this.router.navigateByUrl('admin-tickets');
    } else if (this.router.url.indexOf('employee-tickets') !== -1) {
      this._ticketService.getEmployeeTickets();
    }
    this.matDialogRef.close();
    this._notificationService.showSuccess(`La demande vient d'être envoyée.`);
  }

}
