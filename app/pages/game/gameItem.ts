import {PIXI}  from './pixi';
import {GameModel} from "./GameModel";

export class GameItem extends PIXI.Sprite {
  constructor(){
    super(GameItem.upStateTexture);

    this.upState = GameItem.upStateTexture;
    this.downState = GameItem.downStateTexture;
    this.overState = GameItem.overStateTexture;

    this.registerEvents();
  }

  public registerEvents() {
    // set the mousedown and touchstart callback..
    this.mousedown = this.touchstart = function (data) {
      //console.log('mousedown');
      GameModel.clickedItem = this.id;
      this.setTexture(this.downState);
    };

    // set the mouseup and touchend callback..
    this.mouseup = this.touchend = function (data) {
      //console.log('mouseup');
      GameModel.clickedItem = this.id;
      this.setTexture(this.upState);
    };

    // set the mouseover callback..
    this.mouseover = function (data) {
      //console.log('mouseover');
      this.setTexture(this.overState)
    };

    // set the mouseout callback..
    this.mouseout = function (data) {
      //console.log('mouseout');
      this.setTexture(this.upState)
    };
  }

  public clearEvents() {
    // clear the mousedown and touchstart callback..
    this.mousedown = null;
    // clear the mouseup and touchend callback..
    this.mouseup = null;
    // clear the mouseover callback..
    this.mouseover = null;
    // clear the mouseout callback..
    this.mouseout = null;
  }

  private upState:PIXI.Texture;
  private downState:PIXI.Texture;
  private overState:PIXI.Texture;

  public id:number = -1;

  public static upStateTexture:PIXI.Texture = PIXI.Texture.fromImage('assets/circle01.png');
  public static downStateTexture:PIXI.Texture = PIXI.Texture.fromImage('assets/circle02.png');
  public static overStateTexture:PIXI.Texture = PIXI.Texture.fromImage('assets/circle03.png');

  public static timeOuts:Array<number> = [];

  public highlight():void {
    let scope:any = this;
    if (scope) scope.setTexture(scope.overState);
    GameItem.timeOuts.push(setTimeout(function(){scope.setTexture(scope.upState);}, 1000));
  }

  public static clearAllTimeOuts():void{
    for(let i:number = 0; i < GameItem.timeOuts.length; i++){
      clearTimeout(GameItem.timeOuts[i]);
    }
    GameItem.timeOuts = [];
  }
}
