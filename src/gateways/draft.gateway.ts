import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server } from "socket.io";

import { DraftService } from "../services/draft/draft.service";

@WebSocketGateway({ cors: true })
export class DraftGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly draft: DraftService,
  ) { }

  @SubscribeMessage('players')
  onJoin(@MessageBody() draftId: string) {
    this.server.emit('players', this.draft.get(draftId).players);
  }
}
