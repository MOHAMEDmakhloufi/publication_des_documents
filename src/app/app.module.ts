import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentsComponent } from './documents/documents.component';
import { DNavbarComponent } from './d-navbar/d-navbar.component';
import { DocComponent } from './doc/doc.component';
import { DetailsComponent } from './details/details.component';
import { AuthorsComponent } from './authors/authors.component';
import { AuthComponent } from './auth/auth.component';
import { AuthentificationService } from './_services/authentification.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormDocumentComponent } from './form-document/form-document.component';
import { FormAuthorComponent } from './form-author/form-author.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './_helpers/error.interceptor';

@NgModule({
  declarations: [

    AppComponent,
    DocumentsComponent,
    DNavbarComponent,
    DocComponent,
    DetailsComponent,
    AuthorsComponent,
    AuthComponent,
    FormDocumentComponent,
    FormAuthorComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
    
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
