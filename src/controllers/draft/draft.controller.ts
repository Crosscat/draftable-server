import { Controller, Request, Post, UseGuards, UseFilters, Get, Inject } from '@nestjs/common';

import { DraftService } from '../../services/draft/draft.service';
import { DraftRequest, DraftPickRequest } from '../../interfaces/draft-request.interface';
import { DraftResponse } from '../../interfaces/draft-response.interface';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { PlayerService } from '../../services/player/player.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { DraftPick } from '../../interfaces/draft.interface';
import { Card } from '../../interfaces/card.interface';
import { DraftPickService } from '../../interfaces/draftpick.service.interface';

@Controller('draft')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
export class DraftController {
  constructor(
    private readonly draft: DraftService,
    @Inject('DraftPickService') private readonly draftPick: DraftPickService,
    private readonly player: PlayerService,
  ) { }

  @Post()
  public async join(@Request() req: DraftRequest): Promise<DraftResponse> {
    const player = this.player.get(req.user.userId);
    const draftData = req.body.draftId && this.draft.exists(req.body.draftId) ?
      this.draft.joinExisting(player, req.body.draftId) :
      this.draft.joinNew(player, req);

    const response = {
      draftId: draftData.id,
    }

    console.log(`Player ${player.name} has joined draft ${draftData.id}!`);

    return response;
  }

  @Post('start')
  public async start(@Request() req: any) {
    const player = this.player.get(req.user.userId);

    this.draft.start(player);
    this.draftPick.initialize(this.draft.get(player.draftId));

    console.log(`Player ${player.name} has started draft ${player.draftId}!`);
  }

  @Get()
  public async get(@Request() req: any): Promise<DraftPick> {
    const player = this.player.get(req.user.userId);
    const pick = this.draft.getDraftPick(player);

    console.log(`Player ${player.name} has requested draft pick ${pick}!`);

    return pick;
  }

  @Post()
  public async choose(@Request() req: DraftPickRequest): Promise<Card[]> {
    const player = this.player.get(req.user.userId);
    const newCards = this.draftPick.select(player, req.body.arrangementIndex);
    this.player.addCards(player, newCards);

    console.log(`Player ${player.name} has has chosen ${newCards}!`);

    return player.selected;
  }
}
