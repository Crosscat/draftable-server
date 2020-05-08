import { Test, TestingModule } from '@nestjs/testing';

import { CubeController } from './cube.controller';
import { AppModule } from '../../modules/app.module';

describe('Cube Controller', () => {
  let controller: CubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<CubeController>(CubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
