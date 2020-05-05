import { Component, OnInit, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from '../../users.service';
import { User } from 'app/main/settings/models/user';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Employee } from 'app/common/models/employee';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { DefaultClaim } from 'app/common/models/default-claim';
import { TourSheetService } from 'app/main/tour-sheet/tour-sheet.service';
import { CommonService } from 'app/common/services/common.service';
import { Department } from 'app/main/webcms/models/department';
import { AppService } from 'app/app.service';

@Component({
  selector: 'user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserFormDialogComponent implements OnInit {

  user: User;
  action: string;
  employees: Employee[];
  filtredEmployees: Employee[];
  selectedEmployeeId: number;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  claimsCtrl = new FormControl();
  filteredClaims: Observable<string[]>;
  claims: string[] = [];
  allClaims: string[] = [];
  connectedUser: User;

  @ViewChild('claimInput', { static: false }) claimInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  constructor(
    private commonService: CommonService,
    private appService: AppService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<UserFormDialogComponent>) {

    this.allClaims = [...EmbeddedDatabase.availableClaims];
    if (this.data && this.data.action === 'edit') {
      this.action = this.data.action;
      console.log(this.data.user);
      this.user = { ...this.data.user };
      this.claims = this.getClaimsFromObject(this.user.customClaims);
      if (this.user.customClaims && this.user.customClaims.employeeId && this.user.customClaims.employeeId > 0) {
        this.selectedEmployeeId = this.user.customClaims.employeeId;
      }
    } else if (this.data && this.data.action === 'new') {
      this.action = this.data.action;
      this.user = new User();
      this.claims = [];
      this.selectedEmployeeId = -1;
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our claim
      if ((value || '').trim()) {
        this.claims.push(value.trim());
      }
      if (input) {
        input.value = '';
      }
      this.claimsCtrl.setValue(null);
    }
  }

  remove(claim: string): void {
    const index = this.claims.indexOf(claim);
    if (index >= 0) {
      this.claims.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.claims.findIndex(c => c === event.option.viewValue);
    if (index === -1) {
      this.claims.push(event.option.viewValue);
    }
    this.claimInput.nativeElement.value = '';
    this.claimsCtrl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allClaims.filter(claim => claim.toLowerCase().indexOf(filterValue) === 0);
  }
  private getClaimsFromObject(claims: DefaultClaim): string[] {
    const result: string[] = [];
    if (!claims) {
      return result;
    }
    if (claims.isTechAdmin) {
      result.push('techAdmin');
    }
    if (claims.isRoot) {
      result.push('root');
    }
    if (claims.isGuest) {
      result.push('guest');
    }
    if (claims.isHrM) {
      result.push('HrM');
    }
    if (claims.isSeM) {
      result.push('SeM');
    }
    if (claims.isAdM) {
      result.push('AdM');
    }
    if (claims.isDir) {
      result.push('Dir');
    }

    return result;
  }

  ngOnInit() {
    this.appService.onCurentUserChanged.subscribe(user => {
      if (user) {
        this.connectedUser = user;
        if (!this.connectedUser.customClaims.isRoot) {
          this.allClaims = this.allClaims.filter(c => c !== 'root');
        }
        this.filteredClaims = this.claimsCtrl.valueChanges.pipe(
          startWith(null),
          map((claim: string | null) => claim ? this._filter(claim) : this.allClaims.slice()));
      }
    });
    this.commonService.getEmployees(true).then(result => {
      this.employees = result as Employee[];
      this.filtredEmployees = result as Employee[];
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
