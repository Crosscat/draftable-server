import { Player } from "./player.interface";
import { Card } from "./card.interface";

export interface DraftPickService {
  select(player: Player, arrangementIndex: number): Card[];
  initialize(draftId: string): void;
}
