
export class GameModel {
  constructor(){  }

  public static instance:GameModel;
  public static timeOuts:Array<number> = [];
  public static clickedItem:number = -1;

  public itemSequence:Array<number> = [];
  public clickedItems:Array<number> = [];
  public numOfItems:number = 16;
  public currentScore:number = GameModel.MIN_LEVEL;
  public currentItem:number = 0;
  public trialIsCorrect:boolean = true;
  public faultCount:number = 0;
  public firstOrLastFaultCount:number = 0;
  public clicksCount:number = 0;

  public static get MIN_LEVEL():number {
    return 2;
  }

  public static get MAX_LEVEL():number {
    return 16;
  }

  public static get MAX_DOSE():number {
    if (GameModel.instance.currentLevel < 5){
      return GameModel.instance.currentLevel*75/(2 + 0.5*GameModel.instance.currentLevel);
    }
    return 75;
  }

  public get currentLevel():number{
    return Math.floor(GameModel.instance.currentScore);
  }

  public itemIsInTheSequence(sequence:Array<number> = GameModel.instance.itemSequence):boolean {
    /*console.log("sequence ", sequence);
    console.log("GameModel.instance.itemSequence ", GameModel.instance.itemSequence);*/
    return (sequence.indexOf(GameModel.clickedItem)) >= 0;
  }

  public itemWasClicked():boolean {
    return GameModel.instance.itemIsInTheSequence(GameModel.instance.clickedItems);
  }

  public isTrialOver():boolean{
    return GameModel.instance.currentItem >= GameModel.instance.currentLevel;
  }

  public isTrialCorrect():boolean{
    //console.log("GameModel.instance.itemSequence[GameModel.instance.currentItem]", GameModel.instance.itemSequence[GameModel.instance.currentItem], "GameModel.clickedItem", GameModel.clickedItem);
    return GameModel.instance.itemSequence[GameModel.instance.currentItem] == GameModel.clickedItem;
  }

  public shouldContinueGame():boolean{
    return GameModel.instance.clicksCount <= GameModel.MAX_DOSE && GameModel.instance.currentLevel <= GameModel.MAX_LEVEL;
  }
}
