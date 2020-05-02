import { Controller, Request, Post, UseGuards, UseFilters } from '@nestjs/common';

import { DraftService } from '../../services/draft/draft.service';
import { DraftRequest } from '../../interfaces/draft-request.interface';
import { DraftResponse } from '../../interfaces/draft-response.interface';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { PlayerService } from '../../services/player/player.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('draft')
@UseFilters(new HttpExceptionFilter())
export class DraftController {
  constructor(
    private readonly draft: DraftService,
    private readonly player: PlayerService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async join(@Request() req: DraftRequest): Promise<DraftResponse> {
    const player = this.player.get(req.user.userId);
    const draftData = this.draft.join(player, req.body.draftId);
    const response = {
      draftId: draftData.id,
    }

    return response;
  }
}
