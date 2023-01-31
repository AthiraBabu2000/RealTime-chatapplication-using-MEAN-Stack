import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormBuilder, FormGroup,Validators} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup
  success:boolean=true
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router) {
  this.loginForm=this.fb.group({

    'email':['',Validators.required],
    'password':['',Validators.required]
  })
 }
 getControl(name: any) : AbstractControl | null{
  return this.loginForm.get(name)
}
  ngOnInit(): void {
  }
login(){
 // alert("Login Successsfull!! ")
 const data=this.loginForm.value;

 this.auth.signin(data).subscribe((res)=>{
if(res.success){

  localStorage.setItem('token',res.token)
  localStorage.setItem('id',res.data._id)
  localStorage.setItem('user',res.data.userName)

  alert(res.message)
  console.log(res)
  this.router.navigate(['/home']);
}
else{
  alert(res.message)}


 },err=>{
  alert("login failed")
 })
}


}
