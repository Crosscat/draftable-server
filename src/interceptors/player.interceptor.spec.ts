import { PlayerInterceptor } from './player.interceptor';
import { PlayerService } from '../services/player/player.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Player } from '../interfaces/player.interface';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('PlayerInterceptor', () => {
  it('should be defined', () => {
    expect(new PlayerInterceptor(null)).toBeDefined();
  });

  it('should assign player to request object', () => {
    const playerService = new PlayerService(null);
    const interceptor = new PlayerInterceptor(playerService);

    // const httpContext = {
    //   // getRequest: jest.fn(),
    // } as HttpArgumentsHost;

    let httpContext: HttpArgumentsHost;

    jest.spyOn(httpContext, 'getRequest').mockImplementation(() => { user: { userId: 'x' } });

    let context: ExecutionContext;

    jest.spyOn(context, 'switchToHttp').mockImplementation(() => httpContext);

    // const context = {
    //   switchToHttp: jest.fn(() => httpContext),
    // } as unknown as ExecutionContext;

    const handler = {
      handle: jest.fn(() => {}),
    } as unknown as CallHandler;

    const mockPlayer = { id: 'x' } as Player;
    const playerServiceSpy = jest.spyOn(playerService, 'get').mockImplementation(() => mockPlayer);

    interceptor.intercept(context, handler);

    expect(playerServiceSpy).toHaveBeenCalled();
    expect(context.switchToHttp().getRequest().player).toEqual(mockPlayer);
  });
});
