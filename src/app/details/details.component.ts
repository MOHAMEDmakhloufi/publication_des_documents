import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from '../_services/documents.service';
import { BehaviorSubject } from 'rxjs';
import { Documentf } from '../_interfaces/documentf';
import { UrlService } from '../_services/url.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{

  id: number;
  doc : Documentf;
  private isPageLoading = new BehaviorSubject<boolean>(true);
  isPageLoading$ = this.isPageLoading.asObservable();
  
  constructor(private activatedRoute: ActivatedRoute,
    private service: DocumentsService,
    public urlService: UrlService
  ){}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.getDocById$(this.id).subscribe({
      next: (response) => {
        this.doc = response;
        this.isPageLoading.next(false);
      },
      error: (e)=> {
        this.isPageLoading.next(false);
        alert(e.error?.message);
      }
    });
  }

  onDownload(id: number) {
    this.service.downloadFile(id);
  }
}
