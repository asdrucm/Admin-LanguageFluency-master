import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImproversComponent } from './improvers.component';

describe('ImproversComponent', () => {
  let component: ImproversComponent;
  let fixture: ComponentFixture<ImproversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImproversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImproversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
