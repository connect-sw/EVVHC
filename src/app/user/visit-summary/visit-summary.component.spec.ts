import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitSummaryComponent } from './visit-summary.component';

describe('VisitSummaryComponent', () => {
  let component: VisitSummaryComponent;
  let fixture: ComponentFixture<VisitSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
