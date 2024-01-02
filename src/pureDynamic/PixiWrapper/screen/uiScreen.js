import { Container } from "pixi.js";
import { PureTransform } from "../../core/pureTransform";
import { Alignment } from "../../core/pureTransformConfig";
import { PureRect } from "../pureRect";
import { Debug } from "../../../helpers/debug";
export class UIScreen extends Container {
  constructor(key) {
    super();
    this.key = key;
    this.created = false;
    this.visible = false;
    this._addRoot();
  }

  _addRoot() {
    let transform = new PureTransform({ alignment: Alignment.FULL });
    this.root = new PureRect(transform, transform);
  }

  create() {
    this.created = true;
    Debug.log("UIScreen created", this.key);
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  pause() {
  }

  resume() {
  }

  update() {
  }

  resize() {
  }
}
