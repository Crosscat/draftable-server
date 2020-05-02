import { Test, TestingModule } from '@nestjs/testing';
import { DraftService } from './draft.service';
import { AppModule } from '../../modules/app.module';
import { Player } from '../../interfaces/player.interface';

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

    service.join({} as Player, 'x');

    expect(service.exists('x')).toBeTruthy();
  });

  it('should create new draft with unique id if none provided', () => {
    const draft = service.join({} as Player);
    expect(draft.id).toBeTruthy();
  });

  it('should join existing draft', () => {
    service.join({} as Player, 'x');
    service.join({} as Player, 'x');
    expect(service.get('x').players).toHaveLength(2);
  });

  it('should throw error if id undefined', () => {
    expect(() => service.get('x')).toThrowError('No draft with id x');
  });

  it('should start draft', () => {
    service.join({ id: 'x' } as Player, 'y');
    expect(service.get('y').started).toBeFalsy();
    service.start({ id: 'x', ownsDraft: true } as Player, 'y');
    expect(service.get('y').started).toBeTruthy();
  });

  it('should throw error if trying to join draft that is already started', () => {
    service.join({ id: 'x' } as Player, 'y');
    service.start({ id: 'x', ownsDraft: true } as Player, 'y');
    expect(()=> service.join({} as Player, 'y')).toThrowError(`Draft y already started`);
  });
  
  it('should throw error if trying to start draft that is already started', () => {
    service.join({ id: 'x' } as Player, 'y');
    service.start({ id: 'x', ownsDraft: true } as Player, 'y');
    expect(()=> service.start({} as Player, 'y')).toThrowError(`Draft y already started`);
  });

  it('should throw error trying to start draft that player does not own', () => {
    service.join({ id: 'x' } as Player, 'y');
    service.join({ id: 'z', name: 'bob' } as Player, 'y');
    expect(()=> service.start({ id: 'z', name: 'bob' } as Player, 'y'))
      .toThrowError(`Player bob cannot start the draft`);
  });
});
