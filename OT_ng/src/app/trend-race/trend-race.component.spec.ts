import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendRaceComponent } from './trend-race.component';

describe('TrendRaceComponent', () => {
  let component: TrendRaceComponent;
  let fixture: ComponentFixture<TrendRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendRaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrendRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
