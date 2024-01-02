import { PureNinePatch } from "./pureNinePatch";
import { PureTransform } from "../components/transform/pureTransform";

export class PureNinePatchButton extends PureNinePatch {
  /**
   * @class PureNinePatchButton
   * @param {PIXI.Container} parent 
   * @param {PIXI.Texture} texture 
   * @param {number} left 
   * @param {number} top 
   * @param {number} right 
   * @param {number} bottom 
   * @param {Function} onClick 
   * @param {PureTransform} transformPortrait 
   * @param {PureTransform} transformLandscape 
   */
  constructor(parent, texture, left, top, right, bottom, onClick, transformPortrait = undefined, transformLandscape = undefined) {
    super(parent, texture, left, top, right, bottom, transformPortrait, transformLandscape);
    this.displayObject.eventMode = "dynamic";
    this.displayObject.buttonMode = true;
    this.displayObject.on("pointertap", onClick);
  }
}
