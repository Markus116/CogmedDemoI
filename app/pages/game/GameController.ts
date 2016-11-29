import {GameItem} from "./gameItem";
import {GameModel} from "./GameModel";
import {GameItemsManager} from "./GameItemsManager";

export class GameController {
  constructor(){  }

  public static instance:GameController;

  public generateSequence():Array<number> {
    let sequence:Array<number> = [];
    for (let i:number = 0; i < GameModel.instance.currentLevel; i++){
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

  public updateScore():void{
    if(GameModel.instance.trialIsCorrect) {
      let level:number = GameModel.instance.currentLevel;
      GameModel.instance.currentScore += 0.33;
      console.log('increase score');
      if (GameModel.instance.currentLevel > level) GameModel.instance.currentScore += 0.17;
    }
    else if(GameModel.instance.currentScore > GameModel.MIN_LEVEL){
      GameModel.instance.currentScore -= 0.17*GameModel.instance.firstOrLastFaultCount;
      if(GameModel.instance.faultCount - GameModel.instance.firstOrLastFaultCount > 2){
        GameModel.instance.currentScore -= 0.5;
      }
      else if(GameModel.instance.faultCount - GameModel.instance.firstOrLastFaultCount == 2){
        GameModel.instance.currentScore -= 0.33;
      }
    }
    GameModel.instance.trialIsCorrect = true;
    GameModel.instance.faultCount = 0;
    GameModel.instance.firstOrLastFaultCount = 0;
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
    //console.log("GameModel.instance.currentLevelNumber", GameModel.instance.currentLevel);
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
      GameModel.instance.trialIsCorrect = false; //DoubleCheck wrong first or last against prod
      if(!GameModel.instance.itemIsInTheSequence() || GameModel.instance.itemWasClicked()){ //BUG: If item is in sequence you can press it unlimited times and get no error //Here
        GameModel.instance.faultCount++;
        if(GameModel.instance.clicksCount == 0 || GameModel.instance.clicksCount == GameModel.instance.itemSequence.length - 2) {
          GameModel.instance.firstOrLastFaultCount++;
          //console.log("GameModel.instance.firstOrLastFaultCount", GameModel.instance.firstOrLastFaultCount);
        }
        //console.log("GameModel.instance.firstOrLastFaultCount", GameModel.instance.firstOrLastFaultCount);
        //console.log("GameModel.instance.faultCount", GameModel.instance.faultCount);
      }
      /*else if(GameModel.instance.itemWasClicked()){
        GameModel.instance.faultCount++;
      }*/
    }
    GameModel.instance.clickedItems.push(GameModel.clickedItem);
    GameModel.instance.currentItem++;
    GameModel.instance.clicksCount++;
    if (GameModel.instance.isTrialOver()){
      console.log('next trial');
      GameItemsManager.instance.turnItemsOff();
      GameController.instance.updateScore();
      GameItemsManager.instance.target.view.dispatchEvent(new Event('updateMeters'));
      GameModel.instance.clickedItems = [];
      if (GameModel.instance.shouldContinueGame()){
        GameModel.timeOuts.push(setTimeout(function(){
          GameController.instance.executeStimuli();
        }, 1000));
      }
      else {
        console.log("End of the exercise");
        GameItemsManager.instance.target.view.dispatchEvent(new Event('navigateToLogin'));
      }
    }
  }
}
