import { Injectable } from '@nestjs/common';

import { DraftPickService } from '../../../interfaces/draftpick.service.interface';
import { Draft, DraftPick } from '../../../interfaces/draft.interface';
import { DraftService } from '../../draft/draft.service';
import { Player } from '../../../interfaces/player.interface';
import { Card } from '../../../interfaces/card.interface';

@Injectable()
export class GridDraftPickService implements DraftPickService {
  constructor(
    private readonly draftService: DraftService,
  ) { }

  public select(player: Player, arrangementIndex: number): Card[] {
    if (player.pickQueue == null || player.pickQueue.length === 0 || player.pickQueue[0].remainingPicks <= 0) {
      throw Error('Invalid pick');
    }
    
    const cards = player.pickQueue[0].possibleArrangements[arrangementIndex];
    player.pickQueue[0].remainingPicks--;
    
    // remove taken cards from current pick
    if (player.pickQueue[0].remainingPicks > 0) {
      const pickIds = cards.map(x => x.id);
      Object.keys(player.pickQueue[0].possibleArrangements).forEach(x => {
        player.pickQueue[0].possibleArrangements[x] = player.pickQueue[0].possibleArrangements[x].filter((y: Card) => !pickIds.includes(y.id));
      });
      player.pickQueue[0].cards = player.pickQueue[0].cards.filter(x => !pickIds.includes(x.id));
    }
    
    // pass current pick to next player
    this.pass(player);

    return cards;
  }

  public initialize(draftId: string) {
    const draft = this.draftService.get(draftId);
    draft.outstandingCards = draft.cube;
    
    // hardcoded to 2 player for now
    const pick1 = this.create(draft);
    const pick2 = this.create(draft);
    
    draft.players[0].pickQueue = [pick1];
    draft.players[1].pickQueue = [pick2];
  }

  private create(draft: Draft): DraftPick {
    const cards = this.draftService.draw(draft, 9);
    console.log('CARDS', cards);
    const possibleArrangements = [
      [cards[0], cards[1], cards[2]],
      [cards[3], cards[4], cards[5]],
      [cards[6], cards[7], cards[8]],
      [cards[0], cards[3], cards[6]],
      [cards[1], cards[4], cards[7]],
      [cards[2], cards[5], cards[8]],
    ];

    return {
      cards,
      possibleArrangements,
      remainingPicks: 2,
    }
  }

  private pass(player: Player) {
    let nextPick: DraftPick;
    if (player.pickQueue[0].remainingPicks <= 0) {
      const draft = this.draftService.get(player.draftId);
      nextPick = this.create(draft);
    } else {
      nextPick = player.pickQueue[0];
    }

    const nextPlayer = this.draftService.getNextPlayer(player);
    player.pickQueue.shift();
    nextPlayer.pickQueue.push(nextPick);
  }
}
