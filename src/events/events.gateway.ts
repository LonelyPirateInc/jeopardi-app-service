
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { of, from, Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { GameService } from 'game/game.service';
import { Game } from 'game/game.entity';

@WebSocketGateway(8080, {
  pingTimeout: 3000000,
  pingInterval: 25000,
})
export class EventsGateway {
  @WebSocketServer() server;

  constructor(private readonly gameService: GameService) { }

  messages = [];

  @SubscribeMessage('events')
  onEvent(client, data): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('showQuestion')
  onShowQuestion(client, question: any): void {
    this.server.emit('showQuestion', question);
  }

  @SubscribeMessage('showAnswers')
  onShowMusic(client, answers): void {
    this.server.emit('showAnswers', answers);
  }

  @SubscribeMessage('musicStart')
  onMusicStart(client, data): void {
    const musicSwitch = {
      isMusicOn: true,
    };
    this.server.emit('musicStart', data);
  }

  @SubscribeMessage('readyForGame')
  onClientReadyForGame(client, data): Observable<WsResponse<boolean | Game>> {
    return from(this.gameService.getExistingGame()).pipe(map((game) => ({event: 'gameCheckResult', data: game})));
  }
  // readyForGame
}