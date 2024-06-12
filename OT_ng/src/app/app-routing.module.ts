import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyNumChartComponent } from './company-num-chart/company-num-chart.component';
import { CompanyTrendChartComponent } from './company-trend-chart/company-trend-chart.component';
import { TrendRaceComponent } from './trend-race/trend-race.component';
import { GraduateTrendChartComponent } from './graduate-trend-chart/graduate-trend-chart.component';
import { HomeComponent } from './home/home.component';
import { MultipleComponent } from './multiple/multiple.component';
import { SingleComponent } from './single/single.component';
import { IndustryTrendsComponent } from './industry-trends/industry-trends.component';
import { GraduatesComponent } from './graduates/graduates.component';
import { AppComponent } from './app.component';

const routes: Routes = [
    { 'path': '', component: AppComponent},
    { 'path': 'CompanyNum_Chart', component: CompanyNumChartComponent},
    { 'path': 'CompanyTrend_Chart', component: CompanyTrendChartComponent},
    { 'path': 'Trend_Race', component: TrendRaceComponent},
    { 'path': 'Graduate_Trend', component: GraduateTrendChartComponent},
    { 'path': 'Home', component: HomeComponent },
    { 'path': 'Multiple', component: MultipleComponent },
    { 'path': 'Single', component: SingleComponent },
    { 'path': 'Trends', component: IndustryTrendsComponent },
    { 'path': 'Graduates', component: GraduatesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
