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
  simultaneousPicks: number;
  totalCards: number;
  cardsPerPlayer: number;
  numberOfPlayers: number;
  picksBeforeRefresh: number;
  arrangementsPerPick: number;
}

export interface DraftPick {
  cards: Card[];
  possibleArrangements: Card[][];
  remainingPicks: number;
}
