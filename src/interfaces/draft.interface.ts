import { Player } from "./player.interface";
import { Card } from "./card.interface";

export interface Draft {
  players: Player[];
  cards: Card[];
  direction: Direction;
  type: DraftType;
  id: string;
  started: boolean;
}

export enum Direction {
  Left,
  Right,
}

export enum DraftType {
  Winston,
  Grid,
}
