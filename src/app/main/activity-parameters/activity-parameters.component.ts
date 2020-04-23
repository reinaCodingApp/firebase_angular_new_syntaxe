import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-activity-parameters',
  templateUrl: './activity-parameters.component.html',
  styleUrls: ['./activity-parameters.component.scss'],
  animations: fuseAnimations
})
export class ActivityParametersComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
