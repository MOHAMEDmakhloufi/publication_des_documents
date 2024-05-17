import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorsService } from '../_services/authors.service';
import { Author } from '../_interfaces/author';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-author',
  templateUrl: './form-author.component.html',
  styleUrls: ['./form-author.component.css']
})
export class FormAuthorComponent implements OnInit {
  
  id: number;
  author: Author;

  form : FormGroup;
  
  private isPageLoading = new BehaviorSubject<boolean>(true);
  isPageLoading$ = this.isPageLoading.asObservable();
  
  private isFormLoading = new BehaviorSubject<boolean>(false);
  isFormLoading$ = this.isFormLoading.asObservable();

  constructor(private activatedRoute: ActivatedRoute,
    private service : AuthorsService,
    private fb: FormBuilder,
    private router: Router
  ){}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id']
    if(this.id){
      this.service.getAuthorById$(this.id).subscribe({
        next: (response)=>{
          this.isPageLoading.next(false);
          this.author = response;
          this.initialAuthorFormByAuthor(response);
        },
        error: (e: HttpErrorResponse)=> {
          this.isPageLoading.next(false);
          this.initialAuthorForm();
          alert(e.error?.message);
        }
      })
    }else{
      this.isPageLoading.next(false);
      this.initialAuthorForm()
    }
  }
  formSubmit() {
    this.isFormLoading.next(true);
    this.service.saveAuthor$(this.form.value as Author).subscribe({
      next: (response)=>{
        this.isFormLoading.next(false);
        this.router.navigate(["/authors"])
      },
      error: (e)=> {
        this.isFormLoading.next(false);
        alert(e.error?.message);
      }
    })
  }

  initialAuthorForm(){
    this.form = this.fb.group({
      id: [''],
      firstName : ['', [Validators.required, Validators.minLength(3)]],
      lastName : ['', [Validators.required, Validators.minLength(3)]],
      birthday: ['', [Validators.required]],
      origin : ['', [Validators.required]]
    });
  }
  initialAuthorFormByAuthor(author:Author){
    
    this.form = this.fb.group({
      id: [author.id],
      firstName : [author.firstName, [Validators.required, Validators.minLength(3)]],
      lastName : [author.lastName, [Validators.required, Validators.minLength(3)]],
      birthday: [author.birthday, [Validators.required]],
      origin : [author.origin, [Validators.required]]
    });
  }

}
