import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/modules/app.module';
import { Card } from '../src/interfaces/card.interface';
import { DraftPick } from '../src/interfaces/draft.interface';
import cardsMock from '../src/mocks/democube-small.json';

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

    // player 1 creates player
    let response = await server.post('/player').send({ name: 'bob' });
    const accessToken1 = response.body.accessToken;
    expect(response.status).toBe(201);
    expect(accessToken1).toBeTruthy();

    // player 2 creates player
    response = await server.post('/player').send({ name: 'frank' }); 
    const accessToken2 = response.body.accessToken;
    expect(response.status).toBe(201);
    expect(accessToken2).toBeTruthy();

    // player 1 creates cube
    response = await server.post('/cube').send(cardsMock);
    const cube: Card[] = response.body;
    expect(response.status).toBe(201);
    expect(cube.length).toEqual(20);

    // player 1 creates draft
    response = await server.post('/draft').send({ draftId: 'x', cube }).set('Authorization', `Bearer ${accessToken1}`);
    let draftId = response.body.draftId;
    expect(response.status).toBe(201);
    expect(draftId).toEqual('x');

    // player 2 joins draft
    response = await server.post('/draft').send({ draftId: 'x' }).set('Authorization', `Bearer ${accessToken2}`);
    draftId = response.body.draftId;
    expect(response.status).toBe(201);
    expect(draftId).toEqual('x');

    // player 1 starts draft
    response = await server.post(`/draft/start`).set('Authorization', `Bearer ${accessToken1}`);
    expect(response.status).toBe(201);

    // player 1 gets draft pick data
    response = await server.get(`/draft`).set('Authorization', `Bearer ${accessToken1}`);
    expect(response.status).toBe(200);
    const draftPick1 = response.body as DraftPick;
    expect(draftPick1.cards.length).toBe(9);
    expect(draftPick1.possibleArrangements.length).toBe(6);
    expect(response)
    
    // player 2 gets draft pick data
    const response2 = await server.get(`/draft`).set('Authorization', `Bearer ${accessToken2}`);
    expect(response2.status).toBe(200);
    const draftPick2 = response2.body as DraftPick;
    expect(draftPick2.cards.length).toBe(9);
    expect(draftPick2.possibleArrangements.length).toBe(6);

    expect(draftPick1).not.toEqual(draftPick2);

    // player 1 makes pick
    response = await server.get('/draft')
  });
});
