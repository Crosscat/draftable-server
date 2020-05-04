import { Draft, DraftPick } from "./draft.interface";
import { Player } from "./player.interface";
import { Card } from "./card.interface";

export interface DraftPickService {
  create(draft: Draft): DraftPick;
  select(player: Player, arrangementIndex: number): Card[];
  initialize(draft: Draft);
}
