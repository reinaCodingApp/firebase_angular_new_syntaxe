import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { WebsiteService } from '../../website.service';
import { map } from 'rxjs/operators';
import { FocusService } from './focus.service';
import { Focus } from './models/focus';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';

@Component({
  selector: 'focus',
  templateUrl: './focus.component.html'
})
export class FocusComponent implements OnInit {
  focuses: Focus[];
  displayedColumns = ['date', 'title'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private websiteService: WebsiteService,
    private focusService: FocusService) {
  }

  ngOnInit(): void {
    this.focusService.getFocuses().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Focus;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(focuses => {
      this.focuses = focuses;
    });
    this.websiteService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }
}

