import { Controller, Request, Post, UseGuards, UseFilters, Get } from '@nestjs/common';

import { DraftService } from '../../services/draft/draft.service';
import { DraftRequest, DraftPickRequest } from '../../interfaces/draft-request.interface';
import { DraftResponse } from '../../interfaces/draft-response.interface';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { PlayerService } from '../../services/player/player.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { DraftPick } from '../../interfaces/draft.interface';
import { Card } from '../../interfaces/card.interface';

@Controller('draft')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
export class DraftController {
  constructor(
    private readonly draft: DraftService,
    private readonly player: PlayerService,
  ) { }

  @Post()
  public async join(@Request() req: DraftRequest): Promise<DraftResponse> {
    const player = this.player.get(req.user.userId);
    const draftData = this.draft.join(player, req.body.draftId);
    const response = {
      draftId: draftData.id,
    }

    return response;
  }

  @Post('start')
  public async start(@Request() req: any) {
    const player = this.player.get(req.user.userId);

    this.draft.start(player);
  }

  @Get()
  public async get(@Request() req: any): Promise<DraftPick> {
    const player = this.player.get(req.user.userId);

    return this.draft.getDraftPick(player);
  }

  @Post()
  public async choose(@Request() req: DraftPickRequest): Promise<Card[]> {
    const player = this.player.get(req.user.userId);

    return this.draft.selectPile(player, req.body.pileIndex);
  }
}
