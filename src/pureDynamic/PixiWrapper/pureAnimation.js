import { Texture } from "pixi.js";
import { PureTransform } from "../core/pureTransform";
import { PureObject } from "../core/pureObject";

export class PureAnimation extends PureObject {
  /**
   * @class PureAnimation
   * @param {PIXI.Container} parent 
   * @param {Array<Texture>} textures 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(parent, textures, transformPortrait = undefined, transformLandscape = undefined) {
    super(new PIXI.AnimatedSprite(textures), transformPortrait, transformLandscape);
    parent.addChild(this.displayObject);
  }
}
