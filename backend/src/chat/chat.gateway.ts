import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import type { ChatMessage, SendMessagePayload } from './chat.types';

function normalizeText(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function normalizeUser(value: unknown) {
  const user = normalizeText(value);
  return user || 'Guest';
}

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
    socket.emit('chatHistory', this.chatService.getHistory());
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() _client: Socket,
  ) {
    const user = normalizeUser(payload?.user);
    const text = normalizeText(payload?.text);
    if (!text) return;

    const message: ChatMessage = {
      user,
      text,
      timestamp: Date.now(),
    };

    this.chatService.append(message);
    this.server.emit('newMessage', message);

    return { ok: true };
  }
}
