import { TestBed } from '@angular/core/testing';

import { RecsysService } from './recsys.service';

describe('RecsysService', () => {
  let service: RecsysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecsysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
