import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CheckedCode } from 'app/main/traceability/models/checkedCode';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'tour-sheet-checkedcodes',
  templateUrl: './tour-sheet-checkedcodes.component.html',
  styleUrls: ['./tour-sheet-checkedcodes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TourSheetCheckedcodesComponent implements OnInit {
  @Input() checkedCodes: CheckedCode[];

  displayedColumns = ['typedCode', 'shape', 'site', 'entryDate'];

  constructor() { }

  ngOnInit(): void {
  }

}
