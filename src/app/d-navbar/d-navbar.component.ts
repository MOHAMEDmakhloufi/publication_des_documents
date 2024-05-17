import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../_services/authentification.service';
import { User } from '../_interfaces/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-d-navbar',
  templateUrl: './d-navbar.component.html',
  styleUrls: ['./d-navbar.component.css']
})
export class DNavbarComponent implements OnInit {

  user: User | null;
  constructor(private authService: AuthentificationService,
    private router:Router
  ){

  }
  
  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (response) => this.user = response
    })
  }

  authSwitch(){
    if(this.user){
      this.authService.logout()
    }else{
      this.router.navigate(['/login']);
    }
  }
}
