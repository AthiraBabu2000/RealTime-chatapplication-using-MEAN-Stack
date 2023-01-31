import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ChatService } from '../service/chat.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Breakpoints = Breakpoints;
  Mode:any = {
    value: ''
  }
  @ViewChild(MatDrawer)
  sidebar!: MatDrawer;


  users: any = []
  usersArray: any = [{}]
  id = localStorage.getItem('id')
userName=localStorage.getItem('user')

userDetails = {
  sender: localStorage.getItem('user')
}
mutedUsers:any = []
  blockedUsers:any = []
  loginedUserDetails:any = {}





  constructor(private breakpointObserver:BreakpointObserver,private router:Router,private chatService:ChatService) { }
  onlineStatus=true
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        // this.sidebar.mode = "over";
        this.Mode.value = 'over'
      } else {
        this.Mode.value = "side"
        // this.sidebar.mode = 'side';
      }
    });
    this.chatService.allUsers().subscribe(res => {
      // console.log(res)
      this.users = res
      if (this.usersArray == "") {
        console.log('empty')
        return
      } else {
        this.users.forEach((value: any, index: any) => {
          if (value._id == this.id) {
            this.users.splice(index, 1)
          }
        });
      }

    })
  }



  singleUser(id: any) {
    this.router.navigateByUrl(`home/user/chat/${id}`)
    console.log(id)
    // RouterLinkActive
  }


  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login')
  }
  loginedUser(){
    this.chatService.loginedUser(this.userDetails.sender).subscribe(res=>{
      this.loginedUserDetails = res
      this.mutedUsers = this.loginedUserDetails.mutedUsers
      this.blockedUsers = this.loginedUserDetails.blockedUsers
    })
  }
  }


