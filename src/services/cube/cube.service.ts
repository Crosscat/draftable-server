import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { Card } from '../../interfaces/card.interface';

@Injectable()
export class CubeService {
  constructor(
    private readonly http: HttpService,
  ) { }

  public async create(cards: string[]): Promise<Card[]> {
    return Promise.all(cards.map((card) => this.createCard(card)));
  }

  private async createCard(card: string): Promise<Card> {
    return this.http.get(`https://api.scryfall.com/cards/named?exact=${card}`).pipe(
      map(response => response.data),
      map((data: any) => ({ name: data.name, imageUrl: data.image_uris?.normal })),
    ).toPromise();
  }
}
