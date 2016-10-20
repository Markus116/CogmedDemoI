import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GamePage} from "../game/GamePage";

@Component({
  templateUrl: 'build/pages/video/video.html'
})
export class VideoPage {
  constructor(public navCtrl: NavController) {
  }

  startGame(){
    this.navCtrl.push(GamePage);
  }
}
