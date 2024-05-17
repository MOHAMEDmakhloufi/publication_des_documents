import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if(err.error instanceof Blob){
                err.error.text().then(errorMessage => {
                    const errorObj = JSON.parse(errorMessage);
                    
                    alert(errorObj.message);
                })
            }else
                err.error.message = (err.error.message.toLowerCase().includes("http")) ? "failed" : err.error.message;
            console.error(err);
            return throwError(() => err);
        }))
    }
}