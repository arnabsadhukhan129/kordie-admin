import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaughyByComponent } from './taughy-by.component';

describe('TaughyByComponent', () => {
  let component: TaughyByComponent;
  let fixture: ComponentFixture<TaughyByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaughyByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaughyByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
