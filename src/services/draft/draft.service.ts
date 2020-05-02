import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Draft, DraftPick } from '../../interfaces/draft.interface';
import { Player } from '../../interfaces/player.interface';
import { Card } from '../../interfaces/card.interface';

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

  public join(playerData: Player, draftId?: string): Draft {
    const id = draftId || uuid();

    return this.exists(id) ? this.joinExisting(playerData, id) : this.joinNew(playerData, id);
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

    draft.started = true;
  }

  public getDraftPick(playerData: Player): DraftPick {
    const draft = this.get(playerData.draftId);
    if (!draft.started) {
      throw Error('Draft has not started');
    }

    const draftPick = draft.activePicks.find(x => x.currentPlayer.id === playerData.id);
    if (!draftPick) {
      throw Error('No available picks');
    }

    return draftPick;
  }

  public selectPile(playerData: Player, pileIndex: number): Card[] {
    const draftPick = this.getDraftPick(playerData);
    const picks = draftPick.piles[pileIndex];

    return playerData.picks.concat(picks.cards);
  }

  private joinNew(playerData: Player, draftId: string): Draft {
    const draft = {
      id: draftId,
      players: [playerData],
    } as Draft;
    playerData.ownsDraft = true;

    this.drafts[draftId] = draft;
    
    return draft;
  }

  private joinExisting(playerData: Player, draftId: string): Draft {
    const draft = this.get(draftId);
    if (draft.started) {
      throw Error(`Draft ${draftId} already started`);
    }

    draft.players.push(playerData);
    return draft;
  }
}
