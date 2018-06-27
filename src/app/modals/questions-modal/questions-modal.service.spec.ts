import { TestBed, inject } from '@angular/core/testing';

import { QuestionsModalService } from './questions-modal.service';

describe('QuestionsModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionsModalService]
    });
  });

  it('should be created', inject([QuestionsModalService], (service: QuestionsModalService) => {
    expect(service).toBeTruthy();
  }));
});
