import { Card } from "./card.interface";
import { DraftPick } from "./draft.interface";

export interface Player {
  selected: Card[];
  id: string;
  name: string;
  draftId: string;
  ownsDraft: boolean;
  previousPlayer: Player;
  nextPlayer: Player;
  pickQueue: DraftPick[];
}

export interface PlayerRequest {
  name: string;
}

export interface PlayerResponse {
  playerId: string;
  accessToken: string;
}
