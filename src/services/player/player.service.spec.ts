import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { AppModule } from '../../modules/app.module';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update stored players', async () => {
    const playerId = (await service.new('bob')).playerId;

    expect(service.get(playerId).ownsDraft).toBeFalsy();
    service.get(playerId).ownsDraft = true;
    expect(service.get(playerId).ownsDraft).toBeTruthy();
  });

  it('should create new player', async () => {
    const playerInfo = await service.new('bob');

    expect(playerInfo.accessToken).toBeTruthy();
    expect(playerInfo.playerId).toBeTruthy();
  });

  it('should throw error if player does not exist', () => {
    expect(() => service.get('bob')).toThrowError('Invalid player id');
  });
});
