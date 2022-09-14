import { SharedNotificationService } from './../../../../common/services/shared-notification.service';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Employee } from 'app/common/models/employee';
import { AdvanceSalaryService } from '../../advance-salary.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdvanceSalaryStatus } from '../../models/advanceSalaryStatus';
import { Advance } from '../../models/advance';


@Component({
  selector: 'app-add-advance-salary-dialog',
  templateUrl: './add-advance-salary-dialog.component.html'
})
export class AddAdvanceSalaryDialogComponent implements OnInit {
  newAdvanceSalaryForm: FormGroup;
  employees: Employee[];
  filtredEmployees: Employee[];
  advanceSalariesStatus: AdvanceSalaryStatus[];
  mode = 'add';

  private _unsubscribeAll: Subject<any>;

  constructor(
    public matDialogRef: MatDialogRef<AddAdvanceSalaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Advance,
    private _formBuilder: FormBuilder,
    private _advanceSalaryService: AdvanceSalaryService,
    private sharedNotificationService: SharedNotificationService
  ) {
    this._unsubscribeAll = new Subject();
    this.mode = data ? 'edit' : 'add';
  }

  ngOnInit(): void {
    this._advanceSalaryService.onEmployeesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(employees => {
        this.employees = employees;
        this.filtredEmployees = employees;
      });
    this._advanceSalaryService.onAdvanceSalariesStatusChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(advanceSalariesStatus => {
        this.advanceSalariesStatus = advanceSalariesStatus;
      });
    if (this.mode === 'edit') {
      this.newAdvanceSalaryForm = this._formBuilder.group({
        employee: [{ value: this.data.employee.fullName, disabled: true }],
        observations: [this.data.observations],
        requestAmount: [{ value: this.data.requestAmount, disabled: true }],
        requestDate: [{ value: this.data.requestDate, disabled: true }],
        requestAwarded: [this.data.requestAwarded, [Validators.required, Validators.max(this.data.requestAmount)]],
        advanceSalaryStatus: [this.data.advanceSalaryStatus.id],
        searchInput: ['']
      });
      this.checkStatus(this.data.advanceSalaryStatus.id);
    } else {
      this.newAdvanceSalaryForm = this._formBuilder.group({
        employee: ['', Validators.required],
        observations: [''],
        requestAmount: ['', Validators.required],
        searchInput: ['']
      });
    }

  }

  addAdvanceSalary(): void {
    if (this.newAdvanceSalaryForm.valid) {
      const employeeId = this.newAdvanceSalaryForm.get('employee').value;
      const observations = this.newAdvanceSalaryForm.get('observations').value;
      const requestAmount = this.newAdvanceSalaryForm.get('requestAmount').value;
      const advance = new Advance();
      advance.employee.id = employeeId;
      advance.requestAmount = requestAmount;
      advance.observations = observations;
      
      this._advanceSalaryService.addAdvanceSalary(advance).subscribe((addedAdvance) => {        
        this.sharedNotificationService.showSuccess('Acompte inséré avec succès');
        const advanceSalaries = this._advanceSalaryService.onAdvanceSalariesChanged.getValue();
        advanceSalaries.unshift(addedAdvance);
        this._advanceSalaryService.onAdvanceSalariesChanged.next(advanceSalaries);
        this.matDialogRef.close();
      }, (err) => {
        console.log(err);
      });
    } else {      
      this.sharedNotificationService.showError(`Erreur lors de la création de l'acompte`);
    }
  }

  updateAdvanceSalary(): void {
    if (this.newAdvanceSalaryForm.valid) {
      const observations = this.newAdvanceSalaryForm.get('observations').value;
      const requestAwarded = this.newAdvanceSalaryForm.get('requestAwarded').value;
      const advanceSalaryStatusId = this.newAdvanceSalaryForm.get('advanceSalaryStatus').value;

      this.data.observations = observations;
      this.data.requestAwarded = requestAwarded;
      this.data.advanceSalaryStatus.id = advanceSalaryStatusId;
      
      this._advanceSalaryService.updateAdvanceSalary(this.data).subscribe((updatedAdvance) => {
        const advanceSalaries = this._advanceSalaryService.onAdvanceSalariesChanged.getValue();
        const foundIndex = advanceSalaries.findIndex(x => x.id === this.data.id);
        advanceSalaries[foundIndex] = updatedAdvance;
        this._advanceSalaryService.onAdvanceSalariesChanged.next(advanceSalaries);
        this.matDialogRef.close();
      }, (err) => {
        console.log(err);
      });
    } else {
      console.log('invalid');
    }
  }

  onStatusChange(currentStatus): void {
    this.checkStatus(currentStatus);
  }

  checkStatus(currentStatus): void {
    if (currentStatus === 1) {
      this.newAdvanceSalaryForm.controls['requestAwarded'].enable();
    } else {
      this.newAdvanceSalaryForm.controls['requestAwarded'].disable();
    }
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }


}
