
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway(8083)
export class EventsGateway {
  @WebSocketServer() public server;

  messages = [];

  @SubscribeMessage('events')
  onEvent(client, data): Observable<WsResponse<number>> {
    console.log('events...?');
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }


  @SubscribeMessage('showQuestion')
  onShowQuestion(client, data): Observable<WsResponse<number>> {
    this.server.emit({ event: 'showQuestion', data });
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('showAnswers')
  onShowMusic(client, data): Observable<WsResponse<number>> {
    this.server.emit({ event: 'showAnswers', data });
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('musicStart')
  onMusicStart(client, data): Observable<WsResponse<number>> {
    this.server.emit({event: 'musicStart', data});
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}