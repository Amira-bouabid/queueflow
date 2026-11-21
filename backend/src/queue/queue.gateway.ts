import {
  ConnectedSocket, MessageBody, SubscribeMessage,
  WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Chaque file d'attente = une "room" Socket.io : seuls les clients
// qui suivent cette file reçoivent ses mises à jour.
@WebSocketGateway({ cors: { origin: '*' } })
export class QueueGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('queue:join')
  join(@MessageBody() queueId: number, @ConnectedSocket() client: Socket) {
    client.join(`queue:${queueId}`);
  }

  @SubscribeMessage('queue:leave')
  leave(@MessageBody() queueId: number, @ConnectedSocket() client: Socket) {
    client.leave(`queue:${queueId}`);
  }

  broadcast(queueId: number, tickets: unknown[]) {
    this.server.to(`queue:${queueId}`).emit('queue:update', { queueId, tickets });
  }
}
