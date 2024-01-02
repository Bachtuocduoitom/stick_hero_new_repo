import { Sprite } from "pixi.js";

export class ProgressStar extends PIXI.Container {
  constructor(texUnfill, texFilled) {
    super();
    this._initUnfill(texUnfill);
    this._initFilled(texFilled);
  }

  fill() {
    this.starUnfill.visible = false;
    this.starFilled.visible = true;
  }

  unFill() {
    this.starUnfill.visible = true;
    this.starFilled.visible = false;
  }

  _initUnfill(tex) {
    this.starUnfill = new Sprite(tex);
    this.starUnfill.anchor.set(0.5);
    this.addChild(this.starUnfill);
  }

  _initFilled(tex) {
    this.starFilled = new Sprite(tex);
    this.starFilled.anchor.set(0.5);
    this.starFilled.visible = false;
    this.addChild(this.starFilled);
  }
}
