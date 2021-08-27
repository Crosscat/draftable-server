import { TestingModule, Test } from "@nestjs/testing";

import { JwtStrategy } from "./jwt.strategy";
import { AppModule } from "../modules/app.module";

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