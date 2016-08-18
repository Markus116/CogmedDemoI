import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {VideoPage} from "../video/video";
import {LoginService} from "../../services/app.login.service";

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers:[LoginService]
})
export class LoginPage {
  user = {
    username: '',
    password: ''
  };

  loginForm(form) {
    console.log(form.value);
    if(form.valid){
      this.navCtrl.push(VideoPage);
    }
    //this.auth();
  }

  auth(){
    this.loginService.login().subscribe(
        data => this.authResult(data),
        err => this.authError(err),
        () => console.log('Authentication Complete')
    );

    this.loginService.login2().subscribe(
      data => this.authResult(data),
      err => this.authError(err),
      () => console.log('Authentication Complete')
    );

  }

  authResult(data){
    console.log("RESULT",data);
  }

  authError(err) {
    console.error('There was an error: ' + err);
  }

  constructor(public navCtrl: NavController,private loginService:LoginService) {
  }
}
