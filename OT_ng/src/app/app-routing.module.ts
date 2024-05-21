import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyNumChartComponent } from './company-num-chart/company-num-chart.component'

const routes: Routes = [
    { 'path': 'CompanyNum_Chart', component: CompanyNumChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
