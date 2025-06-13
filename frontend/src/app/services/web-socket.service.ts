import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws!: WebSocket;
  public notesChanged$ = new Subject<void>();

  connect() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'notesChanged') {
          this.notesChanged$.next();
        }
      } catch {}
    };
  }

  send(message: string) {
    this.ws.send(message);
  }
}
