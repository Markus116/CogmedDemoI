import {PIXI}  from './pixi';
import {GamePage} from "./GamePage";
import {GameItem} from "./gameItem";
import {GameModel} from "./GameModel";

export class GameItemsManager extends PIXI.InteractionManager {

  public static instance:GameItemsManager;

  public setTarget(target:any):void {
    super.setTarget(target);

    this.createChildren();
    target.view.addEventListener('mousemove',  this.onMouseOver.bind(this), true);
  }

  private onMouseOver(event:any) {
    event.preventDefault();

    // TODO optimize by not check EVERY TIME! maybe half as often? //
    var rect = this.target.view.getBoundingClientRect();

    this.mouse.global.x = (event.clientX - rect.left) * (this.target.width / rect.width);
    this.mouse.global.y = (event.clientY - rect.top) * ( this.target.height / rect.height);

    var length = this.interactiveItems.length;
    var global = this.mouse.global;


    for (var i = 0; i < length; i++)
    {
      var item = this.interactiveItems[i];

      if(item.mouseover /*&& event.buttons == 0*/)
      {
        item.__hit = this.hitTest(item, this.mouse);
        if(item.__hit)
        {
          //call the function!
          item.mouseover(this.mouse);
          item.__isOver = true;
        }
        else if (item.__isOver){
          item.__isOver = false;
          if (item.mouseout) item.mouseout(this.mouse);
        }
      }
    }
  }

  public turnItemsOn():void{
    console.log("turnItemsOn");
    for(let i:number = 0; i < this.interactiveItems.length; i++){
      this.interactiveItems[i].registerEvents();
    }
    this.target.view.addEventListener('mousedown', GamePage.clickHandler, true);
    this.target.view.dispatchEvent(new Event('switchItemsState'));
  }

  public turnItemsOff(delay:number = 1000):void{
    console.log("turnItemsOff delay", delay);
    this.target.view.removeEventListener('mousedown', GamePage.clickHandler, true);
    let scope:any = this;
    for(let i:number = 0; i < this.interactiveItems.length; i++){
      GameModel.timeOuts.push(setTimeout(function():void{
        scope.interactiveItems[i].clearEvents();
        scope.interactiveItems[i].setTexture(scope.interactiveItems[i].upState);
      }, delay));
    }
    GameModel.timeOuts.push(setTimeout(function():void{
      scope.target.view.dispatchEvent(new Event('switchItemsState'));
    }, delay));
  }

  protected createBackground(imagePath:string):PIXI.Sprite {
    let background:PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.fromImage(imagePath));
    background.position.x = -220;
    background.position.y = -10;
    GamePage.stage.addChild(background);
    return background;
  }

  protected gameBackground:PIXI.Sprite;

  protected createChildren():void {
    this.gameBackground = this.createBackground('assets/background game01.png');

    this.interactiveItems = [];
    for (let i: number = 0; i < GameModel.instance.numOfItems/4; i++) {
      let offsetX: number = i * 115;
      for (let j: number = 0; j < GameModel.instance.numOfItems/4; j++) {
        let offsetY: number = j * 115;
        let gameItem: GameItem = new GameItem();
        gameItem.position.x = 70 + offsetX;
        gameItem.position.y = 70 + offsetY;
        gameItem.id = this.interactiveItems.length;
        this.interactiveItems.push(gameItem);
        GamePage.stage.addChild(gameItem);
      }
    }
  }

}
