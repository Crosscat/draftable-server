import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { Card } from '../src/interfaces/card.interface';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('full draft integration test', async () => {
    const server = request(app.getHttpServer());

    let response = await server.post('/player').send({ name: 'bob' });
    const accessToken1 = response.body.accessToken;
    expect(response.status).toBe(201);
    expect(accessToken1).toBeTruthy();

    response = await server.post('/player').send({ name: 'frank' }); 
    const accessToken2 = response.body.accessToken;
    expect(response.status).toBe(201);
    expect(accessToken2).toBeTruthy();

    response = await server.post('/cube').send({ cards: ["Steam Vents"] });
    const cube: Card[] = response.body;
    expect(response.status).toBe(201);
    expect(cube.length).toEqual(1);

    response = await server.post('/draft').send({ draftId: 'x', cube }).set('Authorization', `Bearer ${accessToken1}`);
    let draftId = response.body.draftId;
    expect(response.status).toBe(201);
    expect(draftId).toEqual('x');

    response = await server.post('/draft').send({ draftId: 'x' }).set('Authorization', `Bearer ${accessToken2}`);
    draftId = response.body.draftId;
    expect(response.status).toBe(201);
    expect(draftId).toEqual('x');

    response = await server.post(`/draft/start`).set('Authorization', `Bearer ${accessToken1}`);
    expect(response.status).toBe(201);

    response = await server.get(`/draft`).set('Authorization', `Bearer ${accessToken1}`);
    console.log(response.body);
  });
});
