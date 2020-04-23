import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FollowupSheetService } from '../followup-sheet.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FollowupSheetRecapViewModel } from 'app/main/followup-sheet/models/followupSheetRecapViewModel';
import { Sheet } from '../models/sheet';
import { SmallSheet } from '../models/smallSheet';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'followup-sheet-recap',
  templateUrl: './followup-sheet-recap.component.html',
  styleUrls: ['./followup-sheet-recap.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FollowupSheetRecapComponent implements OnInit {
  recap: FollowupSheetRecapViewModel[];
  sheetsHistory: SmallSheet[];
  selectedSheet: SmallSheet;
  instanceId: string;

  constructor(
    private _followupSheetService: FollowupSheetService,
    private _fuseConfigService: FuseConfigService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.instanceId = params['i'] === undefined ? '1' : params['i'];
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: { hidden: true },
        footer: { hidden: true },
      }
    };
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
        this._fuseConfigService.config = {
          layout: {
            navbar: { hidden: true },
            footer: { hidden: true },
          }
        };
      });
  }

}
