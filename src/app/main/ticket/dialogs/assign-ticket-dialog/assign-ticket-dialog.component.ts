import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TicketService } from '../../ticket.service';
import { NgForm } from '@angular/forms';
import { Employee } from 'app/main/ticket/models/employee';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Service } from 'app/main/ticket/models/service';

@Component({
  selector: 'app-assign-ticket-dialog',
  templateUrl: './assign-ticket-dialog.component.html',
  styleUrls: ['./assign-ticket-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssignTicketDialogComponent implements OnInit {
  services: Service[];
  employees: Employee[];
  adminstrator: Employee;
  selectedAssignTo: number;
  deadlineDate: any;

  constructor(
    public matDialogRef: MatDialogRef<AssignTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _ticketService: TicketService,
    private _notificationService: SharedNotificationService
  ) { }

  ngOnInit(): void {
    this._ticketService.onTicketViewModelChanged.subscribe((ticketViewModel) => {
      this.services = ticketViewModel.vm.services;
      this.employees = ticketViewModel.vm.members;
      this.adminstrator = ticketViewModel.vm.connectedEmployee;
    });
  }

  assignTicket(form: NgForm): void {
    // if (form.valid) {
    //   this._loaderService.start();
    //   let service = null;
    //   let employee = null;
    //   this.selectedAssignTo.hasOwnProperty('fullName') ?
    //     employee = this.selectedAssignTo :
    //     service = this.selectedAssignTo;
    //   const deadLine = (this.deadlineDate) ?
    //     this.convertStringtoDate(this.deadlineDate.format('DD/MM/YYYY')) :
    //     this.convertStringtoDate(this.data.deadline);
    //   this._ticketService.assignTicket(this.data, this.adminstrator, employee, service, deadLine).subscribe((result) => {
    //     this._ticketService.refreshDataForAdmin();
    //     this.matDialogRef.close();
    //     this._notificationService.showSuccess('Ticket affecté avec succès');
    //   }, (err) => {
    //     console.log(err);
    //     this._notificationService.showStandarError();
    //   });
    // }
  }

  convertStringtoDate(dateString): string {
    const dateParts = dateString.split('/');
    const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject.toLocaleDateString();
  }

}


