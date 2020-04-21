import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  loginUser: string;

  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
     this.authService.login( this.model )
      .subscribe(next => {
        this.loginUser = this.authService.decodedToken.unique_name;
        this.alertify.success('Logged in sucessfully.');
      }, error => {
        this.alertify.error(error);
      }

      );
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    this.alertify.alert('Logged out');
  }

}
