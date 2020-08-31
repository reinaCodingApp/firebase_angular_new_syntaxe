import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'custom-chip-list',
  templateUrl: './custom-chip-list.component.html',
  styleUrls: ['./custom-chip-list.component.scss']
})
export class CustomChipListComponent implements OnInit {
  @Input() allItems: any[];
  @Input() selectedItems: any[] = [];
  @Input() labelTitle: string;
  @Input() removable = true;
  visible = true;
  selectable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemCtrl = new FormControl();
  filteredItems: Observable<any[]>;

  @ViewChild('ItemInput') ItemInput: ElementRef;

  constructor() {
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item) : this.allItems.slice()));
  }

  ngOnInit() {
  }

  remove(indx: number): void {
    this.selectedItems.splice(indx, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = event.option.value;
    if (this.selectedItems == null) {
      this.selectedItems = [];
    }
    const index = this.selectedItems.findIndex(d => d.id === selectedItem.id);
    if (index === -1) {
      this.selectedItems.push(selectedItem);
    }
    this.ItemInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
  }

  private _filter(value: any): string[] {
    return this.allItems.filter(item => item.id === value.id);
  }

}
