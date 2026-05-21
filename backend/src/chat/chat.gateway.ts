// backend/src/chat.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  
  // Tato cesta nyní míří do hlavní složky projektu (music-finder)
  private readonly filePath = path.join(process.cwd(), 'messages.json');
  private messageHistory: { user: string, text: string }[] = [];

  constructor() {
    if (fs.existsSync(this.filePath)) {
      try {
        const data = fs.readFileSync(this.filePath, 'utf8');
        this.messageHistory = JSON.parse(data);
      } catch (e) {
        console.error("Chyba při čtení souboru:", e);
      }
    }
  }

  handleConnection(client: Socket) {
    client.emit('chatHistory', this.messageHistory);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { user: string, text: string }) {
    this.messageHistory.push(payload);
    if (this.messageHistory.length > 50) this.messageHistory.shift();

    // Zápis do souboru v kořenové složce
    fs.writeFileSync(this.filePath, JSON.stringify(this.messageHistory, null, 2));

    this.server.emit('newMessage', payload);
  }
}