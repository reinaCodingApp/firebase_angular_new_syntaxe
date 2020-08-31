import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PossibleValue } from 'app/main/audit/models/possible-value';
import { AuditsService } from '../audit.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-audit-possible-values',
  templateUrl: './audit-possible-values.component.html',
  styleUrls: ['./audit-possible-values.component.scss']
})
export class AuditPossibleValuesComponent implements OnInit, OnDestroy {
  possibleValues: PossibleValue[] = [];
  newPossibleValueName: string;
  selectedPossibleValue: PossibleValue;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  valueCtrl = new FormControl();
  @ViewChild('valueInput') valueInput: ElementRef;

  private unsubscribeAll: Subject<any>;

  constructor(private auditsService: AuditsService, private sharedNotificationService: SharedNotificationService) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.auditsService.onPossibleValuesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(values => {
        this.possibleValues = values;
      });
  }

  addValue(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (!value || value.trim().length === 0) {
      return;
    }
    if (!this.checkValue(value)) {
      if (this.selectedPossibleValue) {
        this.selectedPossibleValue.values.push(value);
        this.auditsService.updatePossibleValue(this.selectedPossibleValue);
      }
    }
    if (input) {
      input.value = '';
    }
    this.valueCtrl.setValue(null);
  }

  removeValue(index: number): void {
    this.selectedPossibleValue.values.splice(index, 1);
    this.auditsService.updatePossibleValue(this.selectedPossibleValue);
  }

  addPossibleValue(): void {
    if (!this.newPossibleValueName || this.newPossibleValueName.trim().length < 3 ||
      this.checkPossibleValueName()) {
      return;
    }
    const newPossibleValue: PossibleValue = { name: this.newPossibleValueName.trim(), index: this.possibleValues.length, values: [] };
    this.auditsService.addPossibleValue(newPossibleValue).then((ref) => {
      newPossibleValue.id = ref.id;
      this.possibleValues.push(newPossibleValue);
      this.newPossibleValueName = '';
      this.sharedNotificationService.showSuccess('La valeur a bien été ajoutée dans la liste ci-dessous');

    });
  }

  deletePossibleValue(): void {
    return;
    this.auditsService.deletePossibleValue(this.selectedPossibleValue).then(() => {
      this.possibleValues = this.possibleValues.filter(p => p.id !== this.selectedPossibleValue.id);
      this.selectedPossibleValue = null;
    });
  }

  checkPossibleValueName(): boolean {
    let result = false;
    const possibleValueName = this.newPossibleValueName.trim().toLowerCase();
    for (const element of this.possibleValues) {
      const p = element.name.trim().toLowerCase();
      if (possibleValueName === p) {
        result = true;
        this.sharedNotificationService.showWarning('Cette valeur existe déjà');
        break;
      }
    }
    return result;
  }

  checkValue(value: string): boolean {
    let result = false;
    const valueToAdd = value.trim().toLowerCase();
    for (const element of this.selectedPossibleValue.values) {
      const v = element.trim().toLowerCase();
      if (valueToAdd === v) {
        result = true;
        this.sharedNotificationService.showWarning('Cette valeur existe déjà!');
        break;
      }
    }
    return result;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
