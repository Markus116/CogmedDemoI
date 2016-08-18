import {Component} from "@angular/core";
import {Platform, ionicBootstrap} from "ionic-angular";
import {StatusBar} from "ionic-native";
import {LoginPage} from "./pages/login/login";
import {HTTP_PROVIDERS} from "@angular/http";
import {LoginService} from "./services/app.login.service";
import {FORM_PROVIDERS, provideForms} from "@angular/forms";

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp,[HTTP_PROVIDERS,LoginService,FORM_PROVIDERS,provideForms()]);
