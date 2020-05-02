import { Test, TestingModule } from '@nestjs/testing';
import { DraftController } from './draft.controller';
import { AppModule } from '../../modules/app.module';
import { DraftRequest } from '../../interfaces/draft-request.interface';
import { DraftService } from '../../services/draft/draft.service';
import { PlayerService } from '../../services/player/player.service';
import { Player } from '../../interfaces/player.interface';
import { Draft } from '../../interfaces/draft.interface';
import { UseFilters, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { response } from 'express';

describe('Draft Controller', () => {
  let controller: DraftController;
  let draftService: DraftService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<DraftController>(DraftController);
    draftService = module.get<DraftService>(DraftService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should join draft', async () => {
    const mockPlayer = {} as Player;
    const playerServiceSpy = jest.spyOn(playerService, 'get').mockImplementation(() => mockPlayer);

    const mockDraft = { id: 'x' } as Draft;
    const draftServiceSpy = jest.spyOn(draftService, 'join').mockImplementation(() => mockDraft);

    const response = await controller.join({ user: { userId: 'x' }, body: { } } as DraftRequest);

    expect(playerServiceSpy).toHaveBeenCalled();
    expect(draftServiceSpy).toHaveBeenCalled();
    expect(response.draftId).toBeTruthy();
  });
});
