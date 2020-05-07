import { Card } from "./card.interface";

export interface DraftRequest {
  user: {
    username: string;
    userId: string;
  };
  body: {
    draftId?: string;
    draftType: string;
    maxPlayers: number;
    cube?: Card[];
  }
}

export interface DraftPickRequest {
  user: {
    username: string;
    userId: string;
  };
  body: {
    arrangementIndex: number;
  }
}
