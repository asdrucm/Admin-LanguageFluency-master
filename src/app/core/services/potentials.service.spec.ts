import { TestBed } from '@angular/core/testing';

import { PotentialsService } from './potentials.service';

describe('PotentialsService', () => {
  let service: PotentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
