import { Injectable } from '@angular/core';
import { Documentf } from '../_interfaces/documentf';
import { FileType } from '../_interfaces/fileType.enum';
import { Observable, catchError, delay, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  apiUrl = environment.apiUrl+"/api/v1/documents";
  constructor(private http : HttpClient) { }

  getAllDocs$  () : Observable<Documentf[]> {
  
    return this.http.get<Documentf[]>(this.apiUrl)
      .pipe(delay(1000));
  }

  getDocById$ (id: number) : Observable<Documentf>{
    return this.http.get<Documentf>(this.apiUrl+"/"+id)
      .pipe(delay(1000));
  }

  saveDoc$ (formData : FormData) : Observable<null>{
    return this.http.post<null>(this.apiUrl, formData)
    .pipe(delay(1000));
  }


  deleteDocById$(id: number) : Observable<null>{
    return this.http.delete<null>(this.apiUrl+"/"+id)
    .pipe(delay(2000));
  }

  searchDocs$(search: string) : Observable<Documentf[]> {
    return this.http.get<Documentf[]>(this.apiUrl+"/prefix?prefix="+search)
      .pipe(delay(1000));
  }

  downloadFile(id: number): void {
    let originFileName = "";
    this.http.get(this.apiUrl + "/origin/" + id).pipe(
      switchMap((response) => {
        originFileName = response["originFileName"];
        console.log(originFileName)
        return this.http.get(this.apiUrl + "/download/" + id, { responseType: 'blob', observe: 'response' })
      })
    ).subscribe({
      next : response => {
        const data: Blob = response.body;
        const downloadUrl: string = window.URL.createObjectURL(data);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = downloadUrl;
        link.download = originFileName;
        link.click();
      },
    error: (e) =>{
      if(!(e.error instanceof Blob))
      alert(e.error?.message);
    }
    });
  }
}
