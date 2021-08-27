import { Test, TestingModule } from '@nestjs/testing';

import { DraftController } from './draft.controller';
import { AppModule } from '../../modules/app.module';
import { NewDraftRequest } from '../../interfaces/draft-request.interface';
import { DraftService } from '../../services/draft/draft.service';
import { Draft, DraftPick } from '../../interfaces/draft.interface';
import { DraftPickService } from '../../interfaces/draftpick.service.interface';
import { Card } from '../../interfaces/card.interface';

describe('Draft Controller', () => {
  let controller: DraftController;
  let draftService: DraftService;
  let draftPickService: DraftPickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<DraftController>(DraftController);
    draftService = module.get<DraftService>(DraftService);
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

    const response = await controller.create({ player: {} }, {} as NewDraftRequest);

    expect(draftServiceSpy).toHaveBeenCalled();
    expect(response.draftId).toBeTruthy();
  });

  it('should join draft', async () => {
    const mockDraft = { id: 'x' } as Draft;
    const draftServiceSpy = jest.spyOn(draftService, 'joinExisting').mockImplementation(() => mockDraft);

    const response = await controller.join({ player: {} }, 'x');

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
    const mockPick = { cards: [ { name: 'x' }], possibleArrangements: [ [ { name: 'x' } ] ], remainingPicks: 1 } as DraftPick;
    const draftServiceSpy = jest.spyOn(draftService, 'getDraftPick').mockImplementation(() => mockPick);

    const response = await controller.get({ player: { draftId: 'y' } });

    expect(draftServiceSpy).toHaveBeenCalled();
    expect(response).toEqual(mockPick);
  });

  it('should choose pick', async () => {
    const mockCards = [{ name: 'x' } as Card];
    const draftPickSpy = jest.spyOn(draftPickService, 'select').mockImplementation(() => mockCards);

    const response = await controller.choose({ player: { draftId: 'y', selected: [] } }, { arrangementIndex: 0 });

    expect(draftPickSpy).toHaveBeenCalled();
    expect(response).toEqual(mockCards);
  });
});
