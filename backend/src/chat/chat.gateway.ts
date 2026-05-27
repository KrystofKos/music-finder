import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Message {
  user: string;
  text: string;
  timestamp: number;
}

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private messageHistory: Message[] = [];

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('chatHistory', this.messageHistory);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { user: string; text: string }) {
    const message: Message = {
      ...payload,
      timestamp: Date.now(),
    };

    this.messageHistory.push(message);

    // Keep only last 100 messages
    if (this.messageHistory.length > 100) {
      this.messageHistory.shift();
    }

    // Broadcast to all connected clients
    this.server.emit('newMessage', message);
  }
}
