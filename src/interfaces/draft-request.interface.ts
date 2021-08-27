import { Card } from "./card.interface";

export interface NewDraftRequest {
  cardsPerPlayer: number;
  draftId?: string;
  draftType: string;
  minPlayers: number;
  maxPlayers: number;
  cube: Card[];
}

export interface DraftPickRequest {
  arrangementIndex: number;
}
