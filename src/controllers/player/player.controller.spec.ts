import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { AppModule } from '../../modules/app.module';
import { PlayerService } from '../../services/player/player.service';
import { PlayerResponse } from '../../interfaces/player.interface';

describe('Player Controller', () => {
  let controller: PlayerController;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new player', () => {
    const mockResponse = Promise.resolve({} as PlayerResponse);
    const spy = jest.spyOn(playerService, 'new').mockImplementation(() => mockResponse);

    controller.createPlayer({ name: 'bob' });

    expect(spy).toHaveBeenCalledWith('bob');
  });
});
