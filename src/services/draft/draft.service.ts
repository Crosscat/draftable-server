import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Draft } from '../../interfaces/draft.interface';
import { Player } from '../../interfaces/player.interface';

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

  public start(playerData: Player, draftId: string) {
    const draft = this.get(draftId);
    if (draft.started) {
      throw Error(`Draft ${draftId} already started`);
    }

    if (!draft.players.some(x => x.id === playerData.id && playerData.ownsDraft)) {
      throw Error(`Player ${playerData.name} cannot start the draft`);
    }

    draft.started = true;
  }

  private joinNew(playerData: Player, draftId: string): Draft {
    const draft = {
      id: draftId,
      players: [playerData],
    } as Draft;

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
