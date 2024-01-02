import { PureTransform } from "../core/pureTransform";
import { PureObject } from "../core/pureObject";

export class PureSprite extends PureObject {

  /**
   * @class PureSprite 
   * @param {PIXI.Container} parent
   * @param {PIXI.Texture} texture 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(texture, transformPortrait = undefined, transformLandscape = undefined) {
    super(new PIXI.Sprite(texture), transformPortrait, transformLandscape);
  }
}