import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyNumChartComponent } from './company-num-chart/company-num-chart.component';
import { CompanyTrendChartComponent } from './company-trend-chart/company-trend-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CompanyNumChartComponent,
    CompanyTrendChartComponent
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
