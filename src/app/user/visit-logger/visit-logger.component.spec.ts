import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLoggerComponent } from './visit-logger.component';

describe('VisitLoggerComponent', () => {
  let component: VisitLoggerComponent;
  let fixture: ComponentFixture<VisitLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitLoggerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
