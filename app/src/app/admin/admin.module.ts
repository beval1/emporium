import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';



@NgModule({
  declarations: [
    DashboardComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
