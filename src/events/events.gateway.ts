
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
    console.log('events...?');
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}