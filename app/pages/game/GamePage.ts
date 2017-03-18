import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {PIXI}  from './pixi';
import {GameItemsManager} from "./GameItemsManager";
import {GameController} from "./GameController";
import {GameModel} from "./GameModel";
import {Utils} from "./Utils";

@Component({
  templateUrl: 'build/pages/game/game.html',
})

export class GamePage {
  public static renderer: PIXI.IRenderer;
  public static stage: PIXI.Stage;
  public static stageContainer:PIXI.DisplayObjectContainer;

  private static adjustDimensions():void{
    let minValue:any = 0.8*Math.min(window.innerWidth, window.innerHeight);
    GamePage.renderer.resize(minValue, minValue);
    GamePage.stageContainer.scale = new PIXI.Point(minValue/STAGE_SCALE, minValue/STAGE_SCALE);
  }

  public static onResize(event:any):void{
    GamePage.adjustDimensions();
  }

  public static animate():void {
    //console.log("Render the stage");
    GamePage.requestFrameHandles.push(requestAnimationFrame(GamePage.animate));

    if (GamePage.renderer && GamePage.stage) {
      GamePage.renderer.render(GamePage.stage);
    }
  }

  //ToDO: Either get rid of this either fix the process trial bug, related to this function's usage
  public static DEFAULT_CLICK_HANDLER:any = function(event:any){
    //GameController.instance.processTrial(event);
    //if(GamePage.scoreText.visible) {GamePage.scoreText.setText("Current score: " + GameModel.instance.currentScore);}
  };

  public static updateMetersHandler(event:any):void{
    if(GameModel.instance.currentLevel >= 4){
      if(GameModel.instance.currentLevel >= GamePage.maxDisplayedNumber){
        GamePage.maxDisplayedNumber = GameModel.instance.currentLevel + 1;
        console.log("Adding the element to the progressMeterScale");
        Scale.addElementToMeter(GamePage.scoreScale.progressMeterScale, "" + GamePage.maxDisplayedNumber);
      } else if(GameModel.instance.currentLevel < GamePage.maxDisplayedNumber - 1){
        console.log("Removing the element from the progressMeterScale");
        GamePage.maxDisplayedNumber = GameModel.instance.currentLevel + 1;
        Scale.removeElementFromMeter(GamePage.scoreScale.progressMeterScale);
      }
      let difference:number = 4;// can be 10;
      if(GamePage.maxDisplayedNumber - GamePage.minDisplayedNumber > difference) {
        GamePage.minDisplayedNumber = GamePage.maxDisplayedNumber - difference;
        GamePage.scoreScale.progressMeterScale[GamePage.scoreScale.progressMeterScale.length - 1].parent.removeChild(GamePage.scoreScale.progressMeterScale[GamePage.scoreScale.progressMeterScale.length - 1]);
        GamePage.scoreScale.progressMeterScale.pop();
      } else if(GamePage.maxDisplayedNumber - GamePage.minDisplayedNumber != difference && GamePage.minDisplayedNumber != 1){
        GamePage.minDisplayedNumber = Math.max(GamePage.maxDisplayedNumber - difference, 1);
        // add element to the bottom of the scale
        GamePage.scoreScale.progressMeterScale.push(new PIXI.Text("" + GamePage.minDisplayedNumber));
        GamePage.scoreScale.progressMeterScale[1].parent.addChild(GamePage.scoreScale.progressMeterScale[GamePage.scoreScale.progressMeterScale.length - 1]);
      }

      Scale.updateMeterScale(GamePage.scoreScale.progressMeterScale,  GamePage.scoreScale.progressMeterScale[1].position.x,
        65 + SCORE_METER_HEIGHT - (SCORE_METER_HEIGHT - 25) * (GameModel.instance.currentLevel + 1 - GamePage.minDisplayedNumber + 1)/(GamePage.maxDisplayedNumber - GamePage.minDisplayedNumber + 1), SCORE_METER_HEIGHT);
    }
    GamePage.scoreScale.progressMeter.height = (SCORE_METER_HEIGHT - 50) * (GameModel.instance.currentScore - GamePage.minDisplayedNumber + 1)/(GamePage.maxDisplayedNumber - GamePage.minDisplayedNumber + 1);
    GamePage.scoreScale.progressMeter.position.y = SCORE_METER_HEIGHT + 62 - GamePage.scoreScale.progressMeter.height;
    GamePage.dosageScale.progressMeter.width = (STAGE_SCALE - 125) * GameModel.instance.clicksCount/GameModel.MAX_DOSE;
  }

  private static navigateToLogin(event:any):void{
    console.log("Navigating to Login");
    setTimeout(function(){
      let navTransitionPromise:any = GamePage.instance.navCtrl.pop();
      navTransitionPromise.then( () => {
          return GamePage.instance.navCtrl.pop();
      });
    }, 1000);
  }

  public static clickHandler:any = GamePage.DEFAULT_CLICK_HANDLER;
  public static scoreText:PIXI.Text = new PIXI.Text("Current score: ");
  public static yourTurnText:PIXI.Text = new PIXI.Text("YOUR TURN !");
  public static goButton:PIXI.Sprite = PIXI.Sprite.fromImage("assets/goButton.png");

  protected createChildren():void {
    GamePage.stage.interactionManager = GameItemsManager.instance = new GameItemsManager();
    GameController.instance = new GameController();
    GameModel.instance = new GameModel();
    GamePage.stage.interactionManager.setTarget(GamePage.renderer);
    GameModel.instance.currentScore = GameModel.MIN_LEVEL;
    GamePage.maxDisplayedNumber = Math.max(5, GameModel.instance.currentScore);
    GamePage.minDisplayedNumber = Math.max(1, GamePage.maxDisplayedNumber - 10);

    let progressMeter:PIXI.Sprite = Scale.createMeter(53, 65, 28, SCORE_METER_HEIGHT);
    let title:PIXI.Text = Utils.createAndPositionText(5, 5, "Level");
    let progressMeterScale:Array<PIXI.Text> = Scale.populateMeterScale(Utils.createArrayForMeter(GamePage.minDisplayedNumber, GamePage.maxDisplayedNumber), 110, 90);
    GamePage.scoreScale = Scale.create(35, 30, 165, SCORE_SCALE_HEIGHT - 25, progressMeter, title, progressMeterScale);
    GamePage.scoreScale.progressMeter.height = (SCORE_METER_HEIGHT - 50) * (GameModel.instance.currentScore - GamePage.minDisplayedNumber + 1)/(GamePage.maxDisplayedNumber - GamePage.minDisplayedNumber + 1);
    GamePage.scoreScale.progressMeter.position.y = SCORE_METER_HEIGHT + 62 - GamePage.scoreScale.progressMeter.height;
    GamePage.scoreScale.addToStage(GamePage.stageContainer);

    progressMeter = Scale.createMeter(30, 50, STAGE_SCALE - 125, 30);
    title = Utils.createAndPositionText(5, 5, "Done");
    GamePage.dosageScale = Scale.create(35, STAGE_SCALE - 180, STAGE_SCALE - 55, 105, progressMeter, title);
    GamePage.dosageScale.progressMeter.width = (STAGE_SCALE - 125) * GameModel.instance.clicksCount/GameModel.MAX_DOSE;
    GamePage.dosageScale.addToStage(GamePage.stageContainer);

    let exerciseTitle:PIXI.Text = Utils.createAndPositionText(232, 35, "Grid");

    GamePage.stageContainer.addChild(exerciseTitle);
    GamePage.stageContainer.addChild(GamePage.overlay);
    GamePage.scoreText.setText("Current score: " + GameModel.instance.currentScore);
    //GamePage.scoreText.visible = false; //ScoreText is for debug purpose
    GamePage.stageContainer.addChild(GamePage.scoreText);
    GamePage.yourTurnText.setText("YOUR TURN !");
    GamePage.yourTurnText.position = new PIXI.Point(GamePage.overlay.width/2, (GamePage.overlay.height - 50)/2);
    GamePage.yourTurnText.visible = false;
    GamePage.stageContainer.addChild(GamePage.yourTurnText);

    GamePage.goButton.position = new PIXI.Point(GamePage.overlay.width/2 + 40, GamePage.overlay.height - 200);
    GamePage.goButton.visible = false;
    GamePage.goButton.setInteractive(true); //Does not work, although tutorial says it should
    GamePage.stage.interactionManager.interactiveItems.push(GamePage.goButton); //ToDO: Get rid of this when find the solution to the line above
    GamePage.goButton.mousedown = GamePage.goButton.touchstart = function(data) {
      console.log("GO_BUTTON_CLICK");
      GamePage.goButton.visible = false;
      GamePage.yourTurnText.visible = true;
      setTimeout(function(){
        GamePage.yourTurnText.visible = false;
        GamePage.overlay.visible = false;
        GameItemsManager.instance.turnItemsOn();
      },1000);
    };
    GamePage.stageContainer.addChild(GamePage.goButton);

    GamePage.adjustDimensions();
    GamePage.requestFrameHandles = [];

    GamePage.renderer.view.addEventListener('switchItemsState', GamePage.switchOverlay, true);
    GamePage.renderer.view.addEventListener('navigateToLogin', GamePage.navigateToLogin, true);
    GamePage.renderer.view.addEventListener('updateMeters', GamePage.updateMetersHandler, true);
    window.addEventListener('resize', GamePage.onResize, true);
  }

  public static switchOverlay():void{ //Here
    console.log("switchOverlay");
    if(GamePage.overlay.visible){
      setTimeout(function(){
        GamePage.yourTurnText.visible = false;
        GamePage.goButton.visible = true;
      },1000);
    }
    else {
      GamePage.overlay.visible = true;
      GamePage.goButton.visible = false;
    }
  }

  private static requestFrameHandles:Array<number> = [];

  ionViewDidEnter(){
    console.log('ionViewDidEnter');
    GamePage.createStageAndRenderer();
    document.getElementById('gameContainer').appendChild(GamePage.renderer.view);

    this.createChildren();
    GamePage.requestFrameHandles.push(requestAnimationFrame( GamePage.animate ));

    GameItemsManager.instance.turnItemsOff(0);
    GameController.instance.executeStimuli();
  }

  private static overlay:PIXI.Sprite;

  ionViewWillLeave(){
    document.getElementById('gameContainer').removeChild(GamePage.renderer.view);
    console.log('ionViewWillLeave');
    GameController.clearAllTimeOuts();
    GamePage.renderer.view.removeEventListener('mousedown', GamePage.clickHandler, true);
    GamePage.renderer.view.removeEventListener('touchstart', GamePage.clickHandler, true);
    GamePage.renderer.view.removeEventListener('switchItemsState', GamePage.switchOverlay, true);
    GamePage.renderer.view.removeEventListener('navigateToLogin', GamePage.navigateToLogin, true);
    GamePage.renderer.view.removeEventListener('updateMeters', GamePage.updateMetersHandler, true);
    GameItemsManager.instance.turnItemsOff(0);
    window.removeEventListener('resize', GamePage.onResize, true);
    GamePage.cancelAnimationFrames();
  }

  private static cancelAnimationFrames():void{
    for(let i:number = 0; i < GamePage.requestFrameHandles.length; i++){
      cancelAnimationFrame(GamePage.requestFrameHandles[i]);
    }
  }

  ionViewLoaded(){
    console.log('ionViewLoaded');
  }

  private static createStageAndRenderer(stageWidth:number = STAGE_SCALE, stageHeight:number = STAGE_SCALE):void {
    console.log('createStageAndRenderer');
    GamePage.overlay = PIXI.Sprite.fromImage('assets/Overlay.bmp');
    GamePage.overlay.position = new PIXI.Point(0,0);
    GamePage.overlay.width = stageWidth;
    GamePage.overlay.height = stageHeight;
    GamePage.overlay.alpha = 0.3;
    GamePage.overlay.visible = false;
    GamePage.stage = null;
    if (!GamePage.stage){
      GamePage.stage = new PIXI.Stage(0xBCBCBC);
      GamePage.stageContainer = new PIXI.DisplayObjectContainer();
      GamePage.stageContainer.position = new PIXI.Point(0,0);
      GamePage.stage.addChild(GamePage.stageContainer);
    }
    // create a renderer instance
    if (!GamePage.renderer) {
      GamePage.renderer = PIXI.autoDetectRenderer(stageWidth/2, stageHeight/2);
    }
  }

  public static instance:GamePage;
  public static dosageScale:Scale;
  public static scoreScale:Scale;
  private static maxDisplayedNumber:number = 5;
  private static minDisplayedNumber:number = 1;

  constructor(private navCtrl: NavController) {
    console.log('Calling a constructor');
    GamePage.instance = this;
  }
}

class Scale extends PIXI.DisplayObjectContainer{
  public background:PIXI.Sprite;
  public title:PIXI.Text;

  public progressMeter:PIXI.Sprite;
  public progressMeterScale:Array<PIXI.Text>;

  public static create(x:number, y:number, width:number, height:number, progressMeter:PIXI.Sprite,
                       title:PIXI.Text, progressMeterScale?:Array<PIXI.Text>):Scale{
    console.log("Creating scale");
    let protoType:Scale = new Scale();
    protoType.position = new PIXI.Point(x,y);
    protoType.background = PIXI.Sprite.fromImage('assets/White.bmp');
    protoType.background.width = width; protoType.background.height = height;

    protoType.progressMeter = progressMeter;
    protoType.title = title;

    if(progressMeterScale) protoType.progressMeterScale = progressMeterScale;
    return protoType;
  }

  public static createMeter(x:number, y:number, width:number, height:number):PIXI.Sprite {
    let meter:PIXI.Sprite = PIXI.Sprite.fromImage('assets/Blue.bmp');
    meter.position = new PIXI.Point(x, y);
    meter.scale = new PIXI.Point(width, height);
    return meter;
  }


  public static populateMeterScale(text:any, textX:number, textY:number):Array<PIXI.Text>{
    let title:Array<PIXI.Text> = new Array<PIXI.Text>();
    let textArray:Array<string> = new Array<string>();
    if(typeof text === "string") {textArray.push(text);}
    else {textArray = text;}
    for (let i:number = 0; i < textArray.length; i++){
      let titleText:PIXI.Text = new PIXI.Text(textArray[i]);
      titleText.position.x = textX;
      titleText.position.y = textY + i * ((SCORE_METER_HEIGHT - 25)/textArray.length);
      title.push(titleText);
    }

    return title;
  }

  public static addElementToMeter (meter:Array<PIXI.Text>, text:string):void {
    //console.log("Adding element to progressMeter");
    meter.unshift(new PIXI.Text(text/* + "unshift"*/));
    meter[meter.length - 1].parent.addChild(meter[0]);
    console.log("Added successfuly");
  }

  public static removeElementFromMeter (meter:Array<PIXI.Text>, index:number = 0):void {
    //console.log("Removing element from progressMeter");
    meter[index].parent.removeChild(meter[index]);
    meter.splice(index,1);
    console.log("Removed successfuly");
  }

  public static updateMeterScale(array:Array<PIXI.Text>, textX:number, textY:number, meterHeight:number):void {
    console.log("updateMeterScale");
    for (let i:number = 0; i < array.length; i++){
      array[i].position.x = textX;
      array[i].position.y = textY + i*((meterHeight - 25)/array.length);
    }
  }

  public addToStage(container:PIXI.DisplayObjectContainer):void{
    container.addChild(this);
    this.background.alpha = 0.0;
    //this.addChild(this.background); //ToDo: Either rework the scale background for this design, or get rid of it
    this.addChild(this.progressMeter);
    this.addChild(this.title);
    if (this.progressMeterScale){
      Utils.addArrayOfObjectsToStage(this, this.progressMeterScale);
    }
  }
}

const STAGE_SCALE:number = 785;

const SCORE_SCALE_HEIGHT:number = 575;

const SCORE_METER_HEIGHT:number = 425;
