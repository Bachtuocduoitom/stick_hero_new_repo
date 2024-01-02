import { PureObject } from "../core/pureObject";
import { PureTransform } from "../core/pureTransform";

export class PureNinePatch extends PureObject {
  /**
   * @class PureNinePatch
   * @param {PIXI.Container} parent 
   * @param {PIXI.Texture} texture 
   * @param {number} left 
   * @param {number} top 
   * @param {number} right 
   * @param {number} bottom 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(texture, left, top, right, bottom, transformPortrait = undefined, transformLandscape = undefined) {
    super(new PIXI.NineSlicePlane(texture, left, top, right, bottom), transformPortrait, transformLandscape);
  }
}
