import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImproverComponent } from './improver.component';

describe('ImproverComponent', () => {
  let component: ImproverComponent;
  let fixture: ComponentFixture<ImproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
