import { Component, OnInit, Input } from '@angular/core';
import { MissionStatsViewModel } from 'app/main/activity-statistics/models/missionStatsViewModel';

@Component({
  selector: 'stats-mission-abroad',
  templateUrl: './stats-mission-abroad.component.html',
  styleUrls: ['./stats-mission-abroad.component.scss']
})
export class StatsMissionAbroadComponent implements OnInit {
  @Input() statsMissionAbroad: MissionStatsViewModel[];
  displayedColumns = ['date', 'montant', 'formule'];

  constructor() { }

  ngOnInit() {
  }

}
