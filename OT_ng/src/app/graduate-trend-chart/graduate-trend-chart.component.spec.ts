import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateTrendChartComponent } from './graduate-trend-chart.component';

describe('GraduateTrendChartComponent', () => {
  let component: GraduateTrendChartComponent;
  let fixture: ComponentFixture<GraduateTrendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraduateTrendChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraduateTrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
