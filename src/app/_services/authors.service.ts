import { Injectable } from '@angular/core';
import { Author } from '../_interfaces/author';
import { Observable, delay, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  apiUrl = environment.apiUrl+"/api/v1/authors";
  constructor(private http : HttpClient) { }

  getAll$  () : Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl)
      .pipe(delay(1000));
  }

  getAuthorById$(id: number) : Observable<Author> {
   
    return this.http.get<Author>(this.apiUrl+"/"+id)
      .pipe(delay(1000));
  }

  deleteAllByIds$(ids): Observable<null>{
    return this.http.post<null>(this.apiUrl+"/ids", ids)
    .pipe(delay(1000));
  }

  saveAuthor$(author: Author): Observable<null> {
   
    return this.http.post<null>(this.apiUrl, author)
    .pipe(delay(1000));
  }
}
