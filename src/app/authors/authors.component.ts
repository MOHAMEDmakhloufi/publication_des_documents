import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Author } from '../_interfaces/author';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthorsService } from '../_services/authors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit{

  @ViewChild('headerCheckbox') headerCheckbox: ElementRef<HTMLInputElement>;
  private isTableChecked = new BehaviorSubject<boolean>(false);
  isTableChecked$ = this.isTableChecked.asObservable();

  dataSubject = new BehaviorSubject<Author[]>(null);

  private isPageLoading = new BehaviorSubject<boolean>(true);
  isPageLoading$ = this.isPageLoading.asObservable();

  constructor(
    private service: AuthorsService,
    private router: Router
  ){

  }
  
  
  ngOnInit(): void {

    this.service.getAll$().subscribe({
      next: (response)=>{
        this.isPageLoading.next(false);
        response.forEach(item => item.checked=false)
        this.dataSubject.next(response);
      },
      error: (e)=> {
        this.isPageLoading.next(false);
        alert(e.error?.message);
      }
    })
  }
  onDelete() {
    var result = confirm("Are you sure you want to delete the selected authors ?");
    if(result){
      this.isPageLoading.next(true);
      let ids = this.dataSubject.value
                      .filter(item => item.checked==true)
                      .map(item => item.id);
      this.service.deleteAllByIds$(ids).subscribe({
        next: (response)=>{
          
          this.dataSubject.next(this.dataSubject.value
            .filter(item => item.checked==false));
          this.isPageLoading.next(false);
        },
        error: (e)=> {
          this.isPageLoading.next(false);
          alert(e.error?.message);
        }
      })
    }
    
  }
  onEdit() {
    let id =this.dataSubject.value.filter(item => item.checked==true)[0].id;
    this.router.navigate(['/edit-author', id])
  }
  toggleAllAuthors(event) {
    const isChecked = event.target.checked;
    this.isTableChecked.next(isChecked)
    this.dataSubject.value.forEach(author => author.checked = isChecked);
  }

  toggleAuthorCheck(author: Author) {
    author.checked = !author.checked;
    if(author.checked ){
      if(!this.headerCheckbox.nativeElement.checked){
        this.isTableChecked.next(true)
        this.headerCheckbox.nativeElement.checked= true;
      }
        
    }else{
      if(this.dataSubject.value.filter(item => item.checked==true).length==0){
        this.isTableChecked.next(false)
        this.headerCheckbox.nativeElement.checked= false;
      }
        
    }
  }
  isJustOneChecked(){
    return this.dataSubject?.value.filter(item => item.checked==true).length==1
  }
}
