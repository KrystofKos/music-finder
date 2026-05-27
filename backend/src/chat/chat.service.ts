import { Injectable } from '@nestjs/common';
import type { ChatMessage } from './chat.types';

const MAX_HISTORY = 200;

@Injectable()
export class ChatService {
  private readonly history: ChatMessage[] = [];

  getHistory(): ChatMessage[] {
    return this.history;
  }

  append(message: ChatMessage) {
    this.history.push(message);
    if (this.history.length > MAX_HISTORY) {
      this.history.splice(0, this.history.length - MAX_HISTORY);
    }
  }
}
