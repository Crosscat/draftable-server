import { Player } from "./player.interface";
import { Card } from "./card.interface";

export interface Draft {
  players: Player[];
  cube: Card[];
  outstandingCards: Card[];
  direction: Direction;
  id: string;
  started: boolean;
  info: DraftInfo;
}

export enum Direction {
  Left,
  Right,
}

export interface DraftInfo {
  cardsPerPlayer: number;
  minPlayers: number;
  maxPlayers: number;
  picksBeforeRefresh: number;
}

export interface DraftPick {
  cards: Card[];
  possibleArrangements: Card[][];
  remainingPicks: number;
}
