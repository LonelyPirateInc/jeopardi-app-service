
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer() server;

  messages = [];

  @SubscribeMessage('events')
  onEvent(client, data): Observable<WsResponse<number>> {
    console.log(typeof Number(process.env.SOCKET_PORT));
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
}