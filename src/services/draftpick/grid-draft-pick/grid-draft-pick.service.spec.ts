import { Test, TestingModule } from '@nestjs/testing';

import { GridDraftPickService } from './grid-draft-pick.service';
import { AppModule } from '../../../modules/app.module';
import { DraftService } from '../../draft/draft.service';
import { Player } from '../../../interfaces/player.interface';
import { DraftRequest } from '../../../interfaces/draft-request.interface';
import sampleCube from '../../../mocks/democube.json';

describe('GridDraftPickService', () => {
  let draftService: DraftService;
  let draftPickService: GridDraftPickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    draftService = module.get<DraftService>(DraftService);
    draftPickService = module.get<GridDraftPickService>('DraftPickService');
  });

  it('should be defined', () => {
    expect(draftPickService).toBeDefined();
  });

  it('should initialize draft picks', () => {
    const request = { body: { draftId: 'x', cube: sampleCube }} as DraftRequest;
    let draft = draftService.joinNew({ id: 'bob' } as Player, request);
    draftService.joinExisting({ id: 'bob2' } as Player, 'x');
    draftPickService.initialize('x');
    
    expect(draft.players[0].pickQueue[0]).toBeTruthy();
    expect(draft.players[1].pickQueue[0]).toBeTruthy();
    expect(draft.cube.length).toBe(18);
    expect(draft.outstandingCards.length).toBe(1);
    expect(draft.players[0].pickQueue[0]).toEqual({});
  });
});
