import { Card } from "./card.interface";

export interface Player {
  selected: Card[];
  picks: Card[];
  id: string;
  name: string;
  draftId: string;
  ownsDraft: boolean;
  previousPlayer: Player;
  nextPlayer: Player;
}

export interface PlayerRequest {
  name: string;
}

export interface PlayerResponse {
  playerId: string;
  accessToken: string;
}
