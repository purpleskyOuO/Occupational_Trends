import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyNumChartComponent } from './company-num-chart/company-num-chart.component';
import { CompanyTrendChartComponent } from './company-trend-chart/company-trend-chart.component';
import { TrendRaceComponent } from './trend-race/trend-race.component';
import { GraduateTrendChartComponent } from './graduate-trend-chart/graduate-trend-chart.component';
import { HomeComponent } from './home/home.component';
import { MultipleComponent } from './multiple/multiple.component';
import { SingleComponent } from './single/single.component';
import { IndustryTrendsComponent } from './industry-trends/industry-trends.component';
import { GraduatesComponent } from './graduates/graduates.component';

@NgModule({
  declarations: [
    AppComponent,
    CompanyNumChartComponent,
    CompanyTrendChartComponent,
    TrendRaceComponent,
    GraduateTrendChartComponent,
    HomeComponent,
    MultipleComponent,
    SingleComponent,
    IndustryTrendsComponent,
    GraduatesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
