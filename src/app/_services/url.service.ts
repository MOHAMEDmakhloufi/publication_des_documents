import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(private http: HttpClient) { }

  getFileIconUrl(fileType: string): Observable<string> {
    const fileIcons = {
      pdf: 'pdf',
      png: 'png',
      jpg: 'jpg',
      jpeg: 'jpg',
      docx: 'doc',
      txt: 'txt',
      gif: 'gif',
      svg: 'svg',
      mp4: 'mp4',
      avi: 'avi',
      mov: 'mov',
      mp3: 'mp3',
      wav: 'wav',
      zip: 'zip',
      rar: 'rar',
      csv: 'csv',
      xlsx: 'xls',
      pptx: 'ppt',
      json: 'json',
      xml: 'xml',
      html: 'html',
      css: 'css',
      js: 'js',
      other: 'raw'
    };

    const iconName = fileIcons[fileType.toLowerCase()];
    if (iconName) {
      const url = `https://coderthemes.com/highdmin/layouts/assets/images/file_icons/${iconName}.svg`;
      return of(url);
      
    } else {
      return of('assets/images/file.png'); 
    }
  }
}
