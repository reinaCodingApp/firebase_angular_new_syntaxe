import { Component, OnInit, Input } from '@angular/core';
import { MissionStatsViewModel } from '../../models/missionStatsViewModel';

@Component({
  selector: 'stats-mission-abroad',
  templateUrl: './stats-mission-abroad.component.html'
})
export class StatsMissionAbroadComponent implements OnInit {
  @Input() statsMissionAbroad: MissionStatsViewModel[];
  displayedColumns = ['date', 'montant', 'formule'];

  constructor() { }

  ngOnInit() {
  }

}
