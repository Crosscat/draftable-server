import { Controller, Request, Post, UseGuards, Get, Inject, Body, UseInterceptors, Param } from '@nestjs/common';

import { DraftService } from '../../services/draft/draft.service';
import { NewDraftRequest, DraftPickRequest } from '../../interfaces/draft-request.interface';
import { DraftResponse } from '../../interfaces/draft-response.interface';
import { PlayerService } from '../../services/player/player.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { DraftPick } from '../../interfaces/draft.interface';
import { Card } from '../../interfaces/card.interface';
import { DraftPickService } from '../../interfaces/draftpick.service.interface';
import { PlayerInterceptor } from '../../interceptors/player.interceptor';
import { Utils } from '../../utils/utils';

@Controller('draft')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PlayerInterceptor)
export class DraftController {
  constructor(
    private readonly draft: DraftService,
    @Inject('DraftPickService') private readonly draftPick: DraftPickService,
    private readonly player: PlayerService,
  ) { }

  @Post()
  public async create(
    @Request() req: any,
    @Body() draftRequest: NewDraftRequest,
  ): Promise<DraftResponse> {
    const draftData = this.draft.joinNew(req.player, draftRequest);

    const response = {
      draftId: draftData.id,
    }

    console.log(`Player ${req.player.name} has joined draft ${draftData.id}!`);

    return response;
  }

  @Post(':draftId')
  public async join(
    @Request() req: any,
    @Param() draftId: string,
  ): Promise<DraftResponse> {
    const draftData = this.draft.joinExisting(req.player, draftId);
    
    const response = {
      draftId: draftData.id,
    }

    console.log(`Player ${req.player.name} has joined draft ${draftData.id}!`);

    return response;
  }

  @Post('start')
  public async start(@Request() req: any) {
    this.draft.start(req.player);
    this.draftPick.initialize(req.player.draftId);

    console.log(`Player ${req.player.name} has started draft ${req.player.draftId}!`);
  }

  @Get()
  public async get(@Request() req: any): Promise<DraftPick> {
    const pick = this.draft.getDraftPick(req.player);

    console.log(`Player ${req.player.name} has requested draft pick ${JSON.stringify(Utils.simplifyPick(pick))}!`);

    return pick;
  }

  @Post('choose')
  public async choose(
    @Request() req: any,
    @Body() draftRequest: DraftPickRequest,
  ): Promise<Card[]> {
    const newCards = this.draftPick.select(req.player, draftRequest.arrangementIndex);
    this.player.addCards(req.player, newCards);

    console.log(`Player ${req.player.name} has has chosen ${JSON.stringify(Utils.simplifyCards(newCards))}!`);

    return req.player.selected;
  }
}
