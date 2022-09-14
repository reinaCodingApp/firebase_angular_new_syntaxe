import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketService } from '../../ticket.service';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Employee } from '../../models/employee';
import { Service } from '../../models/service';

@Component({
  selector: 'app-assign-ticket-dialog',
  templateUrl: './assign-ticket-dialog.component.html'
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
    private _ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this._ticketService.onTicketViewModelChanged.subscribe((ticketViewModel) => {
      this.services = ticketViewModel.vm.services;
      this.employees = ticketViewModel.vm.members;
      this.adminstrator = ticketViewModel.vm.connectedEmployee;
    });
  }

  assignTicket(form: NgForm): void {
  }

  convertStringtoDate(dateString): string {
    const dateParts = dateString.split('/');
    const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject.toLocaleDateString();
  }

}


