import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  MainPageComponent } from './main-page/main-page.component';
import { CompanyNumChartComponent } from './company-num-chart/company-num-chart.component';
import { CompanyTrendChartComponent } from './company-trend-chart/company-trend-chart.component';
import { TrendRaceComponent } from './trend-race/trend-race.component';

const routes: Routes = [
    { 'path': 'Main_Page', component: MainPageComponent},
    { 'path': 'CompanyNum_Chart', component: CompanyNumChartComponent},
    { 'path': 'CompanyTrend_Chart', component: CompanyTrendChartComponent},
    { 'path': 'Trend_Race', component: TrendRaceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
