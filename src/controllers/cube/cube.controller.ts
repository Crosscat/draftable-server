import { Controller, Post, Body, Param } from '@nestjs/common';

import { Card } from '../../interfaces/card.interface';
import { CubeService } from '../../services/cube/cube.service';
import { CubeRequest } from '../../interfaces/cube-request.interface';

@Controller('cube')
export class CubeController {
  constructor(
    private readonly cube: CubeService,
  ) { }

  @Post()
  public create(@Body() req: CubeRequest): Promise<Card[]> {
    return this.cube.create(req.cards);
  }
}
