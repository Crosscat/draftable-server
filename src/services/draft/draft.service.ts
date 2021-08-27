import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Draft, DraftPick, Direction } from '../../interfaces/draft.interface';
import { Player } from '../../interfaces/player.interface';
import { Card } from '../../interfaces/card.interface';
import { NewDraftRequest } from '../../interfaces/draft-request.interface';
import { Utils } from '../../utils/utils';

@Injectable()
export class DraftService {
  private drafts: Record<string, Draft>;
  
  constructor() {
    this.drafts = {};
  }

  public get(id: string): Draft {
    if (!this.drafts.hasOwnProperty(id)) {
      throw Error(`No draft with id ${id}`);
    }

    return this.drafts[id];
  }

  public exists(draftId: string): boolean {
    return this.drafts.hasOwnProperty(draftId);
  }

  public start(playerData: Player) {
    const draftId = playerData.draftId;
    const draft = this.get(draftId);
    if (draft.started) {
      throw Error(`Draft ${draftId} already started`);
    }

    if (!draft.players.some(x => x.id === playerData.id && playerData.ownsDraft)) {
      throw Error(`Player ${playerData.name} cannot start the draft`);
    }

    draft.players = Utils.shuffleArray(draft.players);

    for (let i = 0; i < draft.players.length; i++) {
      draft.players[i].previousPlayer = i < draft.players.length - 1 ? draft.players[i + 1] : draft.players[0];
      draft.players[i].nextPlayer = i > 0 ? draft.players[i - 1] : draft.players[draft.players.length - 1];
    }

    draft.started = true;
  }

  public draw(draft: Draft, number: number): Card[] {
    const cards = draft.outstandingCards.slice(0, number);
    draft.outstandingCards = draft.outstandingCards.slice(number, draft.outstandingCards.length);

    return cards;
  }

  public getDraftPick(playerData: Player): DraftPick {
    const draft = this.get(playerData.draftId);
    if (!draft.started) {
      throw Error('Draft has not started');
    }

    if (!playerData.pickQueue || playerData.pickQueue.length === 0 || !playerData.pickQueue[0]) {
      if (draft.outstandingCards.length === 0 && !draft.players.some(x => x.pickQueue.length > 0)) {
        return { cards: [], possibleArrangements: [], remainingPicks: 0 };
      }

      throw Error('No available picks');
    }

    return playerData.pickQueue[0];
  }

  public getNextPlayer(currentPlayer: Player): Player {
    const draft = this.get(currentPlayer.draftId);
    
    return draft.direction === Direction.Left ? currentPlayer.previousPlayer : currentPlayer.nextPlayer;
  }

  public joinNew(playerData: Player, request: NewDraftRequest): Draft {
    const draftId = request.draftId || uuid();
    const draft = {
      id: draftId,
      players: [playerData],
      cube: request.cube,
      direction: Direction.Left,
      info: {
        cardsPerPlayer: request.cardsPerPlayer,
        maxPlayers: request.maxPlayers,
        minPlayers: request.minPlayers,
      },
    } as Draft;
    playerData.ownsDraft = true;
    playerData.draftId = draftId;

    this.drafts[draftId] = draft;
    
    return draft;
  }

  public joinExisting(playerData: Player, draftId: string): Draft {
    const draft = this.get(draftId);
    if (draft.started) {
      throw Error(`Draft ${draftId} already started`);
    }
    playerData.draftId = draftId;

    draft.players.push(playerData);
    return draft;
  }
}
