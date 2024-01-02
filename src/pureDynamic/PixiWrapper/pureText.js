import { PureObject } from "../core/pureObject";
import { PureTransform } from "../core/pureTransform";
import { GameResizer, Orientation } from "../systems/gameResizer";
import { Util } from "../../helpers/utils";

export class PureText extends PureObject {
  /**
   * @class PureText
   * @param {PIXI.Container} parent 
   * @param {string} text 
   * @param {PureTransform} transformPortrait 
   * @param {PIXI.TextStyle} stylePortrait 
   * @param {PureTransform} transformLandscape 
   * @param {PIXI.TextStyle} styleLandscape use style portrait if null 
   */
  constructor(text, transformPortrait = undefined, stylePortrait = undefined, transformLandscape = undefined, styleLandscape = undefined) {
    super(new PIXI.Text(text), transformPortrait, transformLandscape);

    this.stylePortrait = stylePortrait;
    this.styleLandscape = styleLandscape ? styleLandscape : stylePortrait;
    this.registerOnUpdateTransformCallback(this._onUpdateTransform.bind(this));
    this._onUpdateTransform();
  }

  _onUpdateTransform() {
    let style = GameResizer.orientation === Orientation.Portrait ? this.stylePortrait : this.styleLandscape;
    Util.copyObject(style, this.displayObject.style);
  }
}