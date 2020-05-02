import { JwtStrategy } from "./jwt.strategy";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "../modules/app.module";
import { PlayerController } from "../controllers/player/player.controller";
import { PlayerService } from "../services/player/player.service";

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should validate payload', async () => {
    const data = await strategy.validate({ username: 'bob', sub: '1' });

    expect(data).toEqual({ userId: '1', username: 'bob' });
  });
});