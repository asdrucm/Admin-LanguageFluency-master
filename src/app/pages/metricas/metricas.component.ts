import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss']
})
export class MetricasComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  
  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Metricas', active: true }];
  }

}
