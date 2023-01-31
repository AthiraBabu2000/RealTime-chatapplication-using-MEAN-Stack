import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  signup(data:any):Observable<any>{
      return this.http.post('http://localhost:8080/auth/signup',data)
  }

  signin(data:any):Observable<any>{
    return this.http.post('http://localhost:8080/auth/login',data)
  }

  getProfile(){
    let headers={
      'Authorization':"Bearer" + localStorage.getItem('token')

    }
    return this.http.get('http://localhost:8080/auth/profile',{headers:headers})

  }
}
