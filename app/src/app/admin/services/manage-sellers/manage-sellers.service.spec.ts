import { TestBed } from '@angular/core/testing';

import { ManageSellersService } from './manage-sellers.service';

describe('ManageSellersService', () => {
  let service: ManageSellersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSellersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
