import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { PlayerRequest, PlayerResponse } from '../../interfaces/player.interface';
import { PlayerService } from '../../services/player/player.service';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';

@Controller('player')
@UseFilters(new HttpExceptionFilter())
export class PlayerController {
  constructor(
    private readonly player: PlayerService,
  ) { }

  @Post()
  public async create(@Body() request: PlayerRequest): Promise<PlayerResponse> {
    return this.player.new(request.name);
  }
}
