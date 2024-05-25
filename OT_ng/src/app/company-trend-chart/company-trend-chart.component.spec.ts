import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTrendChartComponent } from './company-trend-chart.component';

describe('CompanyTrendChartComponent', () => {
  let component: CompanyTrendChartComponent;
  let fixture: ComponentFixture<CompanyTrendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyTrendChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyTrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
