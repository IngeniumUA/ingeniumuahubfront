import { TestBed } from '@angular/core/testing';

import { HubaccountService } from './hubaccount.service';

describe('HubaccountService', () => {
  let service: HubaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
