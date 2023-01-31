import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { SocketioService } from '../service/socketio.service';
import { io } from 'socket.io-client';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})



export class ChatroomComponent implements OnInit {

 horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  onlineStatus = "online"
  receiver: any = []         // to receive data coming from backend
  userName = ""
  msg =
    {
      msg: "",
      sender: localStorage.getItem('user'),
      receiver: ""
    }



  messages: any = []         // array to store messages coming from backend
  newMessage = '';           // variable to store new messages when send button clicked

  socket = io('http://localhost:8080')

  userDetails = {
    sender: localStorage.getItem('user'),
    recipient: ""
  }
  value:any

  loginedUserDetails:any={}               // to store logined user's data
  mutedUsers:any = []                     // to store only muted users
  blockedUsers:any = []                   // to store only blocked users
  recipientBlockedUsers:any = []          // to store only blocked users of recipient

  constructor(private activeRoute: ActivatedRoute, private chatService: ChatService,
    private router: Router, private socketioService: SocketioService,
    private snackBar: MatSnackBar) { }



  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.socket.disconnect()
      let id =this.activeRoute.snapshot.paramMap.get('id')
      this.chatService.singleUser(id).subscribe(res => {
        this.receiver = res
        this.receiver = this.receiver[0]
        this.userName = this.receiver.userName
        this.socket = io('http://localhost:8080')
        this.messages = []

        this.userDetails.recipient = this.userName
        this.socket.emit('register', this.userDetails);
        this.socket.on('old_message', (oldMsg) => {
          console.log("from backend ",oldMsg);
          this.messages = oldMsg

        })
        // Listen for messages
        this.socket.on('new_message', (message) => {
          this.openSnackBar(message)
          this.messages.push(message)

        });
      })

    })


  }




  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }



  sendMsg() {

    if(this.newMessage != ""){
      this.msg.msg = this.newMessage
      this.msg.receiver = this.userName
      this.socket.emit('send_message', this.msg );
      this.newMessage = ''
    }


  }

  openSnackBar(msg:any) {
    if(msg.sender == localStorage.getItem('user')){
      return
    }else if(this.mutedUsers.includes(this.userDetails.recipient)){
      return
    }
    else{
      this.snackBar.open(`${msg.sender} : ${msg.msg}`, 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    }


  }


  // mute function
  muteUser(){
    this.chatService.muteUsers(this.userDetails).subscribe(res=>{
      console.log(res);
      this.loginedUser()        // for refreshing to show muted or unmuted
    })
  }

  //Unmute function
  unMuteUser(){
    this.chatService.unMuteUser(this.userDetails).subscribe(res=>{
      console.log(res);
      this.loginedUser()        // for refreshing to show muted or unmuted
    })
  }

  // for storing logined user's details
  loginedUser(){
    this.chatService.loginedUser(this.userDetails.sender).subscribe(res=>{
      this.loginedUserDetails = res
      this.mutedUsers = this.loginedUserDetails.mutedUsers
      this.blockedUsers = this.loginedUserDetails.blockedUsers
      this.recipientBlockedUsers = this.receiver.blockedUsers
      // console.log("sender : ",this.blockedUsers);
      // console.log("recipient : ", this.recipientBlockedUsers);

    })
  }

  // block function
  blockUser(){
    this.chatService.blockUser(this.userDetails).subscribe(res =>{
      console.log(res);
      this.loginedUser()
    })
  }

  // unblock user
  unblockUser(){
    this.chatService.unblockUser(this.userDetails).subscribe(res =>{
      console.log(res);
      this.loginedUser()
    })
  }
}

