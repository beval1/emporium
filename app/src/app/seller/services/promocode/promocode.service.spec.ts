/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PromocodeService } from './promocode.service';

describe('Service: Promocode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromocodeService]
    });
  });

  it('should ...', inject([PromocodeService], (service: PromocodeService) => {
    expect(service).toBeTruthy();
  }));
});
