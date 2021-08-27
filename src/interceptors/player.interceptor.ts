import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { PlayerService } from '../services/player/player.service';

@Injectable()
export class PlayerInterceptor implements NestInterceptor {
  constructor(
    private readonly player: PlayerService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.player = this.player.get(request.user.userId);

    return next.handle();
  }
}
