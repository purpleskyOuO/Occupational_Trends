import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNumChartComponent } from './company-num-chart.component';

describe('CompanyNumChartComponent', () => {
  let component: CompanyNumChartComponent;
  let fixture: ComponentFixture<CompanyNumChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyNumChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyNumChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
