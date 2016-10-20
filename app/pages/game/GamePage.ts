import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {PIXI}  from './pixi';
import {GameItemsManager} from "./GameItemsManager";
import {GameController} from "./GameController";
import {GameModel} from "./GameModel";

@Component({
  templateUrl: 'build/pages/game/game.html',
})

export class GamePage {
  public static renderer: PIXI.IRenderer;
  public static stage: PIXI.Stage;

  private static frameRequested: boolean = false;

  public static animate():void {
    // render the stage
    requestAnimationFrame(GamePage.animate);

    if (GamePage.renderer && GamePage.stage) {
      GamePage.renderer.render(GamePage.stage);
    }
    GamePage.frameRequested = true;
  }

  public static DEFAULT_CLICK_HANDLER:any = function(event:any){
    GameController.instance.processTrial(event);
  };

  public static clickHandler:any = GamePage.DEFAULT_CLICK_HANDLER;

  protected createChildren():void {
    GamePage.stage.interactionManager = GameItemsManager.instance = new GameItemsManager();
    GameController.instance = new GameController();
    GameModel.instance = new GameModel();
    GamePage.stage.interactionManager.setTarget(GamePage.renderer);
    GameModel.instance.currentLevelNumber = 2;
    GamePage.renderer.view.addEventListener('switchItemsState', GamePage.switchOverlay, true);
    GamePage.stage.addChild(GamePage.overlay);
  }

  public static switchOverlay():void{
    GamePage.overlay.visible = !GamePage.overlay.visible;
    console.log("GamePage.overlay.visible", GamePage.overlay.visible);
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter');
    GamePage.createStageAndRenderer(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    document.getElementById('gameContainer').appendChild(GamePage.renderer.view);

    this.createChildren();
    if(!GamePage.frameRequested) requestAnimationFrame( GamePage.animate );

    GameItemsManager.instance.turnItemsOff(0);
    GameController.instance.executeStimuli();
  }

  private static overlay:PIXI.Sprite;

  ionViewWillLeave(){
    document.getElementById('gameContainer').removeChild(GamePage.renderer.view);
    console.log('ionViewWillLeave');
    GameController.clearAllTimeOuts();
    GamePage.renderer.view.removeEventListener('mousedown', GamePage.clickHandler, true);
    GamePage.renderer.view.removeEventListener('switchItemsState', GamePage.switchOverlay, true);
  }

  ionViewLoaded(){
    console.log('ionViewLoaded');
  }

  private static createStageAndRenderer(stageWidth:number = 600, stageHeight:number = 600):void {
    console.log('createStageAndRenderer');
    GamePage.overlay.width = stageWidth;
    GamePage.overlay.height = stageHeight;
    GamePage.overlay.alpha = 0.3;
    GamePage.overlay.visible = false;
    GamePage.stage = null;
    if (!GamePage.stage) GamePage.stage = new PIXI.Stage(0xBCBCBC);
    // create a renderer instance
    if (!GamePage.renderer) {
      GamePage.renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);
    }
  }

  public static instance:GamePage;

  constructor(private navCtrl: NavController) {
    console.log('Calling a constructor');
    GamePage.overlay = PIXI.Sprite.fromImage('assets/Overlay.bmp');
    GamePage.instance = this;
  }
}
