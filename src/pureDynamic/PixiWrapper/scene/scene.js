import { PureRect } from "../pureRect";
import { PureTransform } from "../../core/pureTransform";
import { Alignment } from "../../core/pureTransformConfig";
import { GameResizer } from "../../systems/gameResizer";
import { GameConstant } from "../../../gameConstant";
import { Container } from "pixi.js";
import { UIManager } from "../screen/uiManager";

export class Scene extends Container {
  /**
   * @class Scene
   * @param {string} key Scene key, should be unique
   */
  constructor(key) {
    super();
    this.key = key;
    this.sortableChildren = true;
    this.isCreated = false;
    this.ui = new UIManager();
    this.addChild(this.ui);
    this.ui.zIndex = 100;
    this._addRoot();
  }

  create() {
    this.isCreated = true;
    GameResizer.registerOnResizedCallback(this.resize, this);
  }

  /**
   * @param {number} dt delta time
   */
  update() {
    if (!this.visible) {
      return;
    }
    this.ui.update();
  }

  destroy() {
    GameResizer.unregisterOnResizedCallback(this.resize, this);
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  pause() {
    if (!this.visible) {
      return;
    }
    this.ui.pause();
  }

  resume() {
    if (!this.visible) {
      return;
    }
    this.ui.resume();
  }

  setPause() {}

  _addRoot() {
    let transform = new PureTransform({ alignment: Alignment.FULL });
    this.root = new PureRect(transform, transform);
  }

  resize() {
    if (!this.visible) {
      return;
    }
    this.ui.resize();
  }

  fillRect(rect, color, alpha) {
    GameConstant.DEBUG_FILL_RECTS && rect.fill(this, color, alpha);
  }
}
