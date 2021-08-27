import { Test, TestingModule } from '@nestjs/testing';

import { CubeController } from './cube.controller';
import { AppModule } from '../../modules/app.module';
import { CubeRequest } from '../../interfaces/cube-request.interface';
import { CubeService } from '../../services/cube/cube.service';
import { Card } from '../../interfaces/card.interface';

describe('Cube Controller', () => {
  let controller: CubeController;
  let service: CubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<CubeController>(CubeController);
    service = module.get<CubeService>(CubeService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create cube', async () => {
    const request: CubeRequest = {
      cards: ['card'],
    };

    const cubeServiceSpy = jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve([{ name: 'card' }] as Card[]));
    const cube = await controller.create(request);

    expect(cubeServiceSpy).toHaveBeenCalled();
    expect(cube).toEqual([{ name: 'card' }]);
  });
});
