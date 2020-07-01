import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss'],
  animations: fuseAnimations
})
export class WebsiteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
