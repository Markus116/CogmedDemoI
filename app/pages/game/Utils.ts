import {PIXI}  from './pixi';

export class Utils {
  public static createArrayForMeter(minNumber:number, maxNumber:number):Array<any>{
    let array:Array<string> = [];
    for(let i:number = maxNumber - minNumber; i >= 0; i--){
      array.push("-" + (i + minNumber));
    }
    return array;
  }

  public static addArrayOfObjectsToStage(container:PIXI.DisplayObjectContainer, array:Array<any>):void{
    if(container && array){
      for(let i:number = 0; i < array.length; i++){
        container.addChild(array[i]);
      }
    }
  }

  public static removeArrayOfObjectsFromStage(container:PIXI.DisplayObjectContainer, array:Array<any>):void{
    if(container && array){
      for(let i:number = 0; i < array.length; i++){
        container.removeChild(array[i]);
      }
    }
  }

  public static createAndPositionText(x:number, y:number, caption:string):PIXI.Text {
    let text:PIXI.Text = new PIXI.Text(caption);
    text.position = new PIXI.Point(x, y);
    return text;
  }
}
