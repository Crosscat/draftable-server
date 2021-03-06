import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Player, PlayerResponse } from '../../interfaces/player.interface';
import { AuthService } from '../auth/auth.service';
import { Card } from '../../interfaces/card.interface';

@Injectable()
export class PlayerService {
  private players: Record<string, Player>;

  constructor(
    private readonly auth: AuthService,
  ) { 
    this.players = {};
  }

  public async new(name: string): Promise<PlayerResponse> {
    const playerId = uuid();
    const authInfo = await this.auth.login({ username: name, userId: playerId })
    const player = {
      name,
      id: playerId,
      selected: [],
    } as Player;
    this.players[playerId] = player;

    return { playerId, accessToken: authInfo.access_token };
  }

  public get(id: string): Player {
    if (!this.players.hasOwnProperty(id)) {
      throw Error(`Invalid player id`);
    }

    return this.players[id];
  }

  public addCards(player: Player, cards: Card[]) {
    player.selected = player.selected.concat(cards);
  }
}
