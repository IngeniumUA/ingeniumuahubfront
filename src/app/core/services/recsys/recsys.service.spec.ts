import { TestBed } from '@angular/core/testing';

import { RecSysService } from './rec-sys.service';

describe('RecsysService', () => {
  let service: RecSysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecSysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
