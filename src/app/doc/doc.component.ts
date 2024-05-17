import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthentificationService } from '../_services/authentification.service';
import { User } from '../_interfaces/user';
import { Documentf } from '../_interfaces/documentf';
import { initFlowbite } from 'flowbite';
import { DocumentsService } from '../_services/documents.service';
import { Action } from '../_interfaces/action.enum';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../_services/url.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent implements OnInit, AfterViewInit {
  @Output() action = new EventEmitter<Action>();
  @Input() doc : Documentf;
  @Input() docsSubject :  BehaviorSubject<Documentf[]>;

  dropdownDotsVisible: boolean = false;
  user: User | null;
  constructor(private authService: AuthentificationService,
    private service: DocumentsService,
    public urlService: UrlService,
    private router: Router){}
  
  ngOnInit(): void {

    this.authService.user.subscribe({
      next: (response) => {
        this.user = response;
      }
    })
  }
  ngAfterViewInit(): void {
    if (this.user) {
      initFlowbite(); 
    }
  }

  toggleDropdown() {
    this.dropdownDotsVisible = !this.dropdownDotsVisible;
  }

  onDownload(doc: Documentf) {
    this.service.downloadFile(doc.id);
  }
  onEdit(doc: Documentf) {
    this.router.navigate(['/edit-doc',doc.id]);
  }
  onDelete(doc: Documentf) {
    var result = confirm("Are you sure you want to delete "+doc.title+" doc ?");
    if(result){
      this.action.emit(Action.SDELETE);
      this.service.deleteDocById$(doc.id).subscribe({
        next: (response) => {
          this.action.emit(Action.EDELETE);
          
          this.docsSubject.next(this.docsSubject.value.filter(d => d.id!=doc.id));
        },
        error: (e)=> {
          this.action.emit(Action.EDELETE);
          alert(e.error?.message);
        }
      });
    }
  }

}
