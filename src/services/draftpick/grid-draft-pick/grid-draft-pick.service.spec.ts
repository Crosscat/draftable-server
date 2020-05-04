import { Test, TestingModule } from '@nestjs/testing';
import { GridDraftPickService } from './grid-draft-pick.service';

describe('GridDraftPickService', () => {
  let service: GridDraftPickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GridDraftPickService],
    }).compile();

    service = module.get<GridDraftPickService>(GridDraftPickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
