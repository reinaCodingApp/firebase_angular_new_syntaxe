import { Component, OnInit, ViewEncapsulation, HostBinding, Input } from '@angular/core';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';

@Component({
  selector: 'technical-sheet-item',
  templateUrl: './technical-sheet-item.component.html',
  styleUrls: ['./technical-sheet-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechnicalSheetItemComponent implements OnInit {
  @Input() technicalSheet: TechnicalSheet;

  @HostBinding('class.selected')
  selected: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}

