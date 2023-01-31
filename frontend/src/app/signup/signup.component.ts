import { Component, OnInit } from '@angular/core';
import{AbstractControl, FormBuilder, FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
signupForm!:FormGroup;
message:string='';
className='d-none'
isProcess:boolean=false;
submitted = false
hide=""


  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router) {

   }

  ngOnInit(): void {
    this.signupForm = this.fb.group({

      userName:['', [Validators.required,Validators.minLength(4)]],
      email:['', [Validators.required,Validators.email]],
      password:['', [Validators.required,Validators.minLength(6)]],


    })

  }


getControl(name: any) : AbstractControl | null{
  return this.signupForm.get(name)
}


  signup(){
    console.log(this.signupForm.value)
    this.isProcess=true;
    const data=this.signupForm.value;
    delete data['confirm']
   this.auth.signup(data).subscribe(res=>{
   if(res.success){
    this.isProcess=false;
    this.message="Account Has Been Created ";
    this.className='alert alert-success';
   }else{
    this.isProcess=false;
    this.message=res.message;
    this.className='alert alert-danger';
   }
    //this.signupForm.reset();

   },err=>{
    this.isProcess=false;
    this.message="server Error";
    this.className='alert alert-danger';

   })
  }
}
