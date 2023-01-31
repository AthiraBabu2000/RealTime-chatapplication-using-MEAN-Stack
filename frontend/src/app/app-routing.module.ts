import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { DefaultpageComponent } from './defaultpage/defaultpage.component';
const routes: Routes = [
{path:'',component:LoginComponent},
{path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},

{path:'home',component:HomeComponent,
children:[
  {path:'',component:DefaultpageComponent},
  {path:'user/chat/:id',component:ChatroomComponent}
]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
