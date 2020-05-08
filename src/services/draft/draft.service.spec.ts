import { Test, TestingModule } from '@nestjs/testing';

import { DraftService } from './draft.service';
import { AppModule } from '../../modules/app.module';
import { Player } from '../../interfaces/player.interface';
import { DraftRequest } from '../../interfaces/draft-request.interface';

describe('DraftService', () => {
  let service: DraftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<DraftService>(DraftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new draft', () => {
    expect(service.exists('x')).toBeFalsy();

    service.joinNew({} as Player, { body: { draftId: 'x' } } as DraftRequest);

    expect(service.exists('x')).toBeTruthy();
  });

  it('should create new draft with unique id if none provided', () => {
    const draft = service.joinNew({} as Player, { body: {} } as DraftRequest);
    expect(draft.id).toBeTruthy();
  });

  it('should join existing draft', () => {
    service.joinNew({} as Player, { body: { draftId: 'x' } } as DraftRequest);
    service.joinExisting({} as Player, 'x');
    expect(service.get('x').players).toHaveLength(2);
  });

  it('should throw error if id undefined', () => {
    expect(() => service.get('x')).toThrowError('No draft with id x');
  });

  it('should start draft', () => {
    service.joinNew({ id: 'x' } as Player, { body: { draftId: 'y' } } as DraftRequest);
    expect(service.get('y').started).toBeFalsy();
    service.start({ id: 'x', ownsDraft: true, draftId: 'y' } as Player);
    expect(service.get('y').started).toBeTruthy();
  });

  it('should throw error if trying to join draft that is already started', () => {
    service.joinNew({ id: 'x' } as Player, { body: { draftId: 'y' } } as DraftRequest);
    service.start({ id: 'x', ownsDraft: true, draftId: 'y' } as Player);
    expect(()=> service.joinExisting({} as Player, 'y')).toThrowError(`Draft y already started`);
  });
  
  it('should throw error if trying to start draft that is already started', () => {
    service.joinNew({ id: 'x' } as Player, { body: { draftId: 'y' } } as DraftRequest);
    service.start({ id: 'x', ownsDraft: true, draftId: 'y' } as Player);
    expect(()=> service.start({ draftId: 'y' } as Player)).toThrowError(`Draft y already started`);
  });

  it('should throw error trying to start draft that player does not own', () => {
    service.joinNew({ id: 'x' } as Player, { body: { draftId: 'y' } } as DraftRequest);
    service.joinExisting({ id: 'z', name: 'bob' } as Player, 'y');
    expect(()=> service.start({ id: 'z', name: 'bob', draftId: 'y' } as Player))
      .toThrowError(`Player bob cannot start the draft`);
  });
});
