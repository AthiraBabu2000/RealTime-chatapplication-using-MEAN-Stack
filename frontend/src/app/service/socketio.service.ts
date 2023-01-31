import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  SOCKET_ENDPOINT = 'http://localhost:8080'
  socket:any
  constructor() { }


}
