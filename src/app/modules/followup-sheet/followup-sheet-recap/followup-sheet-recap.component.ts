import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FollowupSheetService } from '../followup-sheet.service';
import { SmallSheet } from '../models/smallSheet';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { FollowupSheetRecapViewModel } from '../models/followupSheetRecapViewModel';

@Component({
  selector: 'followup-sheet-recap',
  templateUrl: './followup-sheet-recap.component.html'
})

export class FollowupSheetRecapComponent implements OnInit {
  recap: FollowupSheetRecapViewModel[];
  sheetsHistory: SmallSheet[];
  selectedSheet: SmallSheet;
  instanceId: string;

  constructor(
    private _followupSheetService: FollowupSheetService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.instanceId = params['i'] === undefined ? '1' : params['i'];
    });
  }

  ngOnInit(): void {
    this._followupSheetService.onRecapChanged.subscribe((data) => {
      this.recap = data.recap;
      this.sheetsHistory = data.sheetsHistory;
      this.selectedSheet = this.sheetsHistory.find(s => s.id === data.sheetId);
    });
  }

  getFollowupSheet(): void {
    this.router.navigate(['/followupSheet/getSheetRecap'],
      {
        queryParams: {
          g: this.selectedSheet.identifier,
          w: this.selectedSheet.weekNumber,
          i: this.instanceId
        }
      }).then(() => {
      });
  }

}
