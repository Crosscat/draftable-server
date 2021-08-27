import { DraftPick } from "../interfaces/draft.interface";
import { Card } from "../interfaces/card.interface";

export class Utils {
  public static shuffleArray(array: any[]): any[] {
    let currentIndex = array.length;
    let temp: any[];
    let randomIndex: number;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  }

  public static simplifyPick(pick: DraftPick): string[][] {
    return pick.possibleArrangements.map(arrangement => 
      this.simplifyCards(arrangement),
    );
  }

  public static simplifyCards(cards: Card[]): string[] {
    return cards.map(x => x?.name);
  }
}
