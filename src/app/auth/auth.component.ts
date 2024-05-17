import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../_services/authentification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  form : FormGroup;
  private isFormLoading = new BehaviorSubject<boolean>(false);
  isFormLoading$ = this.isFormLoading.asObservable();
  constructor(private authService: AuthentificationService,
    private fb: FormBuilder,
    private router: Router
  ){

  }
  ngOnInit(): void {
    this.initialAuthForm();
  }

  connect(){
    this.isFormLoading.next(true)
    this.authService.logIn$(this.form.value as User).subscribe({
      next: (response)=>{
        this.isFormLoading.next(false);
        this.router.navigate(["/documents"])
      },
      error: (e)=> {
        this.isFormLoading.next(false);
        alert(e.error?.message);
      }
    })
  }

  initialAuthForm(){
    this.form = this.fb.group({
      username : ['', [Validators.required, Validators.minLength(3)]],
      password : ['', [Validators.required, Validators.minLength(3)]]
    });
  }
}
