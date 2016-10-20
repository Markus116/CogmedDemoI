import {GameItem} from "./gameItem";
import {GameModel} from "./GameModel";
import {GameItemsManager} from "./GameItemsManager";

export class GameController {
  constructor(){  }

  public static instance:GameController;

  public generateSequence():Array<number> {
    let sequence:Array<number> = [];
    for (let i:number = 0; i < GameModel.instance.currentLevelNumber; i++){
      let element:number;
      do{
        element = Math.floor(Math.random()*GameModel.instance.numOfItems);
      }while(!this.isUnique(element, sequence));
      sequence.push(element);
    }
    return sequence;
  }

  private isUnique(element:number, sequence:Array<number>):boolean{
    for (let i:number = 0; i < sequence.length; i++){
      if (element == sequence[i]) return false;
    }
    return true;
  }

  public increaseLevelIfCorrect():void{
    if(GameModel.instance.trialIsCorrect) {
      GameModel.instance.currentLevelNumber++;
      console.log('increase level');
    }
    GameModel.instance.trialIsCorrect = true;
    GameModel.instance.currentItem = 0;
  }

  public static clearAllTimeOuts():void{
    for(let i:number = 0; i < GameModel.timeOuts.length; i++){
      clearTimeout(GameModel.timeOuts[i]);
    }
    GameModel.timeOuts = [];
    GameItem.clearAllTimeOuts();
  }

  public executeStimuli():void {
    console.log("GameModel.instance.currentLevelNumber", GameModel.instance.currentLevelNumber);
    GameModel.instance.itemSequence = GameController.instance.generateSequence();
    for(let i:number = 0; i < GameModel.instance.itemSequence.length; i++){
      GameModel.timeOuts.push(setTimeout(function(){GameItemsManager.instance.interactiveItems[GameModel.instance.itemSequence[i]].highlight();}, i*2000 + 1000));
    }
    GameModel.timeOuts.push(setTimeout(function(){
      GameItemsManager.instance.turnItemsOn();
    }, GameModel.instance.itemSequence.length * 2000 /*+ 1000*/));
  }

  public processTrial(event:any):void{
    console.log('processTrial');
    if(!GameModel.instance.isTrialCorrect()){
      console.log('trial is not correct');
      GameModel.instance.trialIsCorrect = false;
    }
    GameModel.instance.currentItem++;
    if (GameModel.instance.isTrialOver()){
      console.log('next trial');
      GameItemsManager.instance.turnItemsOff();
      GameController.instance.increaseLevelIfCorrect();
      GameModel.timeOuts.push(setTimeout(function(){
        GameController.instance.executeStimuli();
      }, 1000));
    }
  }
}
