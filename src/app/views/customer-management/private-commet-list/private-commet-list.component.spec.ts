import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateCommetListComponent } from './private-commet-list.component';

describe('PrivateCommetListComponent', () => {
  let component: PrivateCommetListComponent;
  let fixture: ComponentFixture<PrivateCommetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateCommetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateCommetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
