import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialsComponent } from './potentials.component';

describe('PotentialsComponent', () => {
  let component: PotentialsComponent;
  let fixture: ComponentFixture<PotentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PotentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PotentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
