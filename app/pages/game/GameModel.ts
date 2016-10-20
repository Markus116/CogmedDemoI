
export class GameModel {
  constructor(){  }

  public static instance:GameModel;
  public static timeOuts:Array<number> = [];
  public static clickedItem:number = -1;

  public itemSequence:Array<number> = [];
  public numOfItems:number = 16;
  public currentLevelNumber:number;
  public currentItem:number = 0;
  public trialIsCorrect:boolean = true;

  public isTrialOver():boolean{
    return GameModel.instance.currentItem >= GameModel.instance.currentLevelNumber;
  }

  public isTrialCorrect():boolean{
    //console.log("GameModel.instance.itemSequence[GameModel.instance.currentItem]", GameModel.instance.itemSequence[GameModel.instance.currentItem], "GameModel.clickedItem", GameModel.clickedItem);
    return GameModel.instance.itemSequence[GameModel.instance.currentItem] == GameModel.clickedItem;
  }
}
