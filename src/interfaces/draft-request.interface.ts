export interface DraftRequest {
  user: {
    username: string;
    userId: string;
  };
  body: {
    draftId?: string;
    draftType: string;
    maxPlayers: number;
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
