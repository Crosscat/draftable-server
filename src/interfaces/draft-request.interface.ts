import { DraftType } from "./draft.interface";

export interface DraftRequest {
  user: {
    username: string;
    userId: string;
  };
  body: {
    draftId?: string;
    draftType: DraftType;
    maxPlayers: number;
  }
}
