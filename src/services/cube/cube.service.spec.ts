import { Test, TestingModule } from '@nestjs/testing';

import { CubeService } from './cube.service';
import { AppModule } from '../../modules/app.module';

describe('CubeService', () => {
  let service: CubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CubeService>(CubeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
