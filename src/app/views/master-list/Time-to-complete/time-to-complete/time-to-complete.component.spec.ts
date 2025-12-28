import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeToCompleteComponent } from './time-to-complete.component';

describe('TimeToCompleteComponent', () => {
  let component: TimeToCompleteComponent;
  let fixture: ComponentFixture<TimeToCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeToCompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeToCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
