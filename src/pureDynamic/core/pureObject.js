import { PureTransform } from "./pureTransform";
import { GameResizer, Orientation } from "../systems/gameResizer";
import { EventEmitter } from "events";
import { PurePoint } from "./purePoint";

export class PureObject {
  /**
   * @class PureObject
   * @param {any} displayObject have atleast x, y, width, height properties
   * @param {PureTransform} transformPortrait
   * @param {PureTransform} transformLandscape use transform portrait if not provided
   */
  constructor(displayObject, transformPortrait = undefined, transformLandscape = undefined) {
    this.emitter = new EventEmitter();
    this._posOffset = new PurePoint(); // translated position offset since object created on current game size
    this.skipMovement = false; // do not adding position offset on update transform
    this.maintainMovementRatio = false; // maitain offset position of object after being created by screen ratio
    this.updateTransformManually = false; // will not call update transform on game resize

    this.displayObject = displayObject;

    this.transformPortrait = transformPortrait ? transformPortrait : new PureTransform();
    this.transformLandscape = transformLandscape ? transformLandscape : this.transformPortrait;
    this.transformPortrait.setup(this);
    if (this.transformLandscape !== this.transformPortrait) {
      this.transformLandscape.setup(this);
    }

    this._updateTransform();
    GameResizer.registerOnResizeCallback(this._updateTransform.bind(this));
  }

  _updateTransform() {
    if (this.updateTransformManually) {
      return;
    }

    let transform = this.transform;
    transform.updateConfig();

    // size
    if (!transform.config.useOriginalSize) {
      this.displayObject.width = transform.width;
      this.displayObject.height = transform.height;
    }

    // position
    if (this.displayObject.anchor && !transform.config.ignorePivot) {
      this.displayObject.anchor.set(transform.pivot.x, transform.pivot.y);
      this.displayObject.x = transform.x;
      this.displayObject.y = transform.y;
    }
    else {
      this.displayObject.x = transform.x - transform.width * transform.pivot.x;
      this.displayObject.y = transform.y - transform.height * transform.pivot.y;
    }

    // position offset
    if (!this.skipMovement) {
      if (this.maintainMovementRatio) {
        this._posOffset.x *= GameResizer.width / GameResizer.lastResize.width;
        this._posOffset.y *= GameResizer.height / GameResizer.lastResize.height;
      }
      this.displayObject.x += this._posOffset.x;
      this.displayObject.y += this._posOffset.y;
    }

    // rotation
    if (this.displayObject.angle) {
      this.displayObject.angle = transform.angle;
    }

    this.emitter.emit("updatetransform");
  }

  /**
   *
   * @param {Function} fn
   */
  registerOnUpdateTransformCallback(fn) {
    this.emitter.on("updatetransform", fn);
  }

  get x() {
    return this.displayObject.x;
  }

  /**
   * @param {number} value
   */
  set x(value) {
    this._posOffset.x += value - this.displayObject.x;
    this.displayObject.x = value;
  }

  get y() {
    return this.displayObject.y;
  }

  /**
   * @param {number} value
   */
  set y(value) {
    this._posOffset.y += value - this.displayObject.y;
    this.displayObject.y = value;
  }

  get width() {
    return this.displayObject.width;
  }

  /**
   * @param {number} value
   */
  set width(value) {
    this.displayObject.width = value;
  }

  get height() {
    return this.displayObject.height;
  }

  /**
   * @param {number} value
   */
  set height(value) {
    this.displayObject.height = value;
  }

  get angle() {
    return this.displayObject.angle;
  }

  /**
   * @param {number} value
   */
  set angle(value) {
    this.transformPortrait.config.angle = this.transformLandscape.config.angle = value;
    this.displayObject.angle = value;
  }

  /**
   * Return transform of the current orientation
   */
  get transform() {
    return GameResizer.orientation === Orientation.Portrait ? this.transformPortrait : this.transformLandscape;
  }

  set visible(value) {
    this.displayObject.visible = value;
  }

  get visible() {
    return this.displayObject.visible;
  }
}
