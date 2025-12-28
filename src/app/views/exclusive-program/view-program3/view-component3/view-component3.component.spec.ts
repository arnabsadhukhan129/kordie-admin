import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent3Component } from './view-component3.component';

describe('ViewComponent3Component', () => {
  let component: ViewComponent3Component;
  let fixture: ComponentFixture<ViewComponent3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComponent3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewComponent3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
