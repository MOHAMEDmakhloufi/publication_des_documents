import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../_interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private userSubject : BehaviorSubject<User | null>;
  public user : Observable<User | null>;

  apiUrl = environment.apiUrl+"/api/v1/auth";

  constructor(
    private router : Router,
    private http : HttpClient
  ) { 
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user_')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }
  
  logIn$(user:User) : Observable<null>{
    return this.http.post<null>(this.apiUrl, user).pipe(
      tap(()=> {
        localStorage.setItem('user_', JSON.stringify(user));
        this.userSubject.next(user);
    }), delay(1000)
  );
  };

  logout() {
    localStorage.removeItem('user_');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }
}
