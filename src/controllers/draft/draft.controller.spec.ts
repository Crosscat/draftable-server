import { Test, TestingModule } from '@nestjs/testing';

import { DraftController } from './draft.controller';
import { AppModule } from '../../modules/app.module';
import { DraftRequest } from '../../interfaces/draft-request.interface';
import { DraftService } from '../../services/draft/draft.service';
import { PlayerService } from '../../services/player/player.service';
import { Player } from '../../interfaces/player.interface';
import { Draft, DraftPick } from '../../interfaces/draft.interface';
import { DraftPickService } from '../../interfaces/draftpick.service.interface';
import { Card } from '../../interfaces/card.interface';

describe('Draft Controller', () => {
  let controller: DraftController;
  let draftService: DraftService;
  let playerService: PlayerService;
  let draftPickService: DraftPickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<DraftController>(DraftController);
    draftService = module.get<DraftService>(DraftService);
    playerService = module.get<PlayerService>(PlayerService);
    draftPickService = module.get<DraftPickService>('DraftPickService');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create draft', async () => {
    const mockDraft = { id: 'x' } as Draft;
    const draftServiceSpy = jest.spyOn(draftService, 'joinNew').mockImplementation(() => mockDraft);

    const response = await controller.join({ player: {} }, {} as DraftRequest);

    expect(draftServiceSpy).toHaveBeenCalled();
    expect(response.draftId).toBeTruthy();
  });

  it('should join draft', async () => {
    const mockDraft = { id: 'x' } as Draft;
    const draftServiceSpy = jest.spyOn(draftService, 'joinExisting').mockImplementation(() => mockDraft);
    const draftExistsSpy = jest.spyOn(draftService, 'exists').mockImplementation(() => true);

    const response = await controller.join({ player: {} }, { draftId: 'y' } as DraftRequest);

    expect(draftExistsSpy).toHaveBeenCalled();
    expect(draftServiceSpy).toHaveBeenCalled();
    expect(response.draftId).toBeTruthy();
  });

  it('should start draft', async () => {
    const draftPickServiceSpy = jest.spyOn(draftPickService, 'initialize').mockImplementation();
    const draftServiceSpy = jest.spyOn(draftService, 'start').mockImplementation();

    await controller.start({ player: { draftId: 'y' } });
    
    expect(draftPickServiceSpy).toHaveBeenCalled();
    expect(draftServiceSpy).toHaveBeenCalled();
  });

  it('should get draft data', async () => {
    const mockPick = { cards: [ { id: 'x' }], possibleArrangements: [ [ { id: 'x' } ] ], remainingPicks: 1 } as DraftPick;
    const draftServiceSpy = jest.spyOn(draftService, 'getDraftPick').mockImplementation(() => mockPick);
    const response = await controller.get({ player: { draftId: 'y' } });

    expect(draftServiceSpy).toHaveBeenCalled();
    expect(response).toEqual(mockPick);
  });

  it('should choose pick', async () => {
    const mockCards = [{ name: 'x' } as Card];
    const draftPickSpy = jest.spyOn(draftPickService, 'select').mockImplementation(() => mockCards);
    const addCardsSpy = jest.spyOn(playerService, 'addCards').mockImplementation();

    const response = await controller.choose({ player: { draftId: 'y' } }, { arrangementIndex: 0 });

    expect(draftPickSpy).toHaveBeenCalled();
    expect(addCardsSpy).toHaveBeenCalled();
    expect(response).toEqual(mockCards)
  });
});
