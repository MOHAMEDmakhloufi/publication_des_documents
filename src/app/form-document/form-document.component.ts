import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Documentf } from '../_interfaces/documentf';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../_services/documents.service';
import { AuthorsService } from '../_services/authors.service';
import { Author } from '../_interfaces/author';

@Component({
  selector: 'app-form-document',
  templateUrl: './form-document.component.html',
  styleUrls: ['./form-document.component.css']
})
export class FormDocumentComponent implements OnInit{
  
  id: number;
  doc: Documentf;

  form : FormGroup;
  private file : File;
  authorsSubject = new BehaviorSubject<Author[]>(null);
  
  private isPageLoading = new BehaviorSubject<boolean>(true);
  isPageLoading$ = this.isPageLoading.asObservable();
  private isAuthorLoading = new BehaviorSubject<boolean>(true);
  isAuthorLoading$ = this.isAuthorLoading.asObservable();
  private isFormLoading = new BehaviorSubject<boolean>(false);
  isFormLoading$ = this.isFormLoading.asObservable();

  constructor(private activatedRoute: ActivatedRoute,
    private service : DocumentsService,
    private authorService: AuthorsService,
    private fb: FormBuilder,
    private router: Router 
  ){}
 
  

  ngOnInit(): void {
    this.initialDocForm()
    this.id = this.activatedRoute.snapshot.params['id']

    this.authorService.getAll$().subscribe({
      next: (response)=>{
        this.isAuthorLoading.next(false);
        response.forEach(item => item.checked=false)
        this.authorsSubject.next(response);
        
        if(!this.isPageLoading.value && this.id)
          this.initialDocFormByDoc(this.doc)

      },
      error: (e)=> {
        this.isAuthorLoading.next(false);
        alert(e.error?.message);
      }
    })

    if(this.id){
      this.service.getDocById$(this.id).subscribe({
        next: (response)=>{
          this.isPageLoading.next(false);
          this.doc = response;
          this.initialDocFormByDoc(response);
        },
        error: (e)=> {
          this.isPageLoading.next(false);
          alert(e.error?.message);
        }
      })
    }else{
      this.isPageLoading.next(false);
     
    }
  }
  
  formSubmit() {
    
    const formData = new FormData();
    if(this.file)
      formData.append('file', this.file, this.file.name)
    
    const docString = JSON.stringify(this.form.value as Documentf);
    formData.append('doc', docString);

    this.isFormLoading.next(true);
    this.service.saveDoc$(formData).subscribe({
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

  initialDocForm(){
    this.form = this.fb.group({
      id: [''],
      title : ['', [Validators.required, Validators.minLength(3)]],
      theme : ['', [Validators.required, Validators.minLength(3)]],
      resume : [''],
      authorId : ['', [Validators.required]],
      file: [null, [Validators.required]],
      keyWords : ['']
    });
  }
  initialDocFormByDoc(doc: Documentf){
    
    this.form = this.fb.group({
      id: [doc.id],
      title : [doc.title, [Validators.required, Validators.minLength(3)]],
      theme : [doc.theme, [Validators.required, Validators.minLength(3)]],
      resume : [doc.resume],
      authorId : [doc.author.id, [Validators.required]],
      file: [null],
      keyWords : [doc.keyWords]
    });
  } 

  onFileChange(event: any): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.file = file;
    this.form.patchValue({
      file: file
    });
  }

}
