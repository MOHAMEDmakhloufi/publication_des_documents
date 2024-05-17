import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { DetailsComponent } from './details/details.component';
import { AuthorsComponent } from './authors/authors.component';
import { AuthComponent } from './auth/auth.component';
import { FormDocumentComponent } from './form-document/form-document.component';
import { FormAuthorComponent } from './form-author/form-author.component';
import { AdminGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {path: 'documents', component: DocumentsComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: 'authors', component: AuthorsComponent, canActivate:[AdminGuard]},
  {path: 'login', component: AuthComponent},
  {path: 'upload', component: FormDocumentComponent, canActivate:[AdminGuard]},
  {path: 'edit-doc/:id', component: FormDocumentComponent, canActivate:[AdminGuard]},
  {path: 'add-author', component: FormAuthorComponent, canActivate:[AdminGuard]},
  {path: 'edit-author/:id', component: FormAuthorComponent, canActivate:[AdminGuard]},

  {path: '**', redirectTo: 'documents'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
