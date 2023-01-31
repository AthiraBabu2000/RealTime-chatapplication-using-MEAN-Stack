import { Injectable } from '@angular/core';
import { io,Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http:HttpClient) { }

  api:string="http://localhost:8080";

  allUsers(){
    return this.http.get(`${this.api}/user/users`);
  }

  singleUser(id:any){
    return this.http.get(`${this.api}/user/chat/${id}`)
  }
}
