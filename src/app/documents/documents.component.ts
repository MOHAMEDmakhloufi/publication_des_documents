import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../_services/authentification.service';
import { User } from '../_interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { Documentf } from '../_interfaces/documentf';
import { DocumentsService } from '../_services/documents.service';
import { Action } from '../_interfaces/action.enum';
import { Router } from '@angular/router';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  search : string = '';

  dataSubject = new BehaviorSubject<Documentf[]>(null);
  private data$ = this.dataSubject.asObservable();

  private isPageLoading = new BehaviorSubject<boolean>(true);
  isPageLoading$ = this.isPageLoading.asObservable();

  user: User | null;
  text: string;
  
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private authService: AuthentificationService,
    private service: DocumentsService,
    private router: Router
  ){

  }
  
  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (response) => this.user = response
    })

    this.service.getAllDocs$().subscribe({
      next: (response)=>{
        this.isPageLoading.next(false);
        this.dataSubject.next(response);
      },
      error: (e)=> {
        this.isPageLoading.next(false);
        alert(e.error?.message);
      }
    })
  }

  onClickAction(event: Action){
   
    if(event== Action.SDELETE){
      this.isLoading.next(true)
      this.text = "start deleting";
    }
      
    if(event== Action.EDELETE){
      this.isLoading.next(false);
      this.text = "document was deleted !"
    }
  }

  onUpload(){
    this.router.navigate(['/upload']);
  }
  onSearch(){
    this.isPageLoading.next(true)
    if(this.search==null || this.search=='')
      this.ngOnInit();
    else{
      
      this.service.searchDocs$(this.search).subscribe({
        next: (response)=>{
          this.isPageLoading.next(false);
          this.dataSubject.next(response);
        },
        error: (e)=> {
          this.isPageLoading.next(false);
          alert(e.error?.message);
        }
      })
    }
  }
}
