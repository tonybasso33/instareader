import { Component, OnInit } from '@angular/core';
import * as config from '../../../globals'; 

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

     datapath  = config.dataPath;
  constructor() { }

  ngOnInit(): void {
  }

}
