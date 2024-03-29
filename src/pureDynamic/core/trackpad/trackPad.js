import { Point, Rectangle } from "pixi.js";
import { SlidingNumber } from "./slidingNumber";

export class TrackPad {
  constructor(options) {
    this.disableEasing = false;
    this.xAxis = new SlidingNumber({
      ease: options.xEase,
      maxSpeed: options.maxSpeed,
      constrain: options.constrain
    });
    this.yAxis = new SlidingNumber({
      ease: options.yEase,
      maxSpeed: options.maxSpeed,
      constrain: options.constrain
    });
    this.disableEasing = options.disableEasing ?? false;
    this._frame = new Rectangle();
    this._bounds = new Rectangle();
    this._globalPosition = new Point();
  }
  pointerDown(pos) {
    this._globalPosition = pos;
    this.xAxis.grab(pos.x);
    this.yAxis.grab(pos.y);
    this._isDown = true;
  }
  pointerUp() {
    this._isDown = false;
  }
  pointerMove(pos) {
    this._globalPosition = pos;
  }
  update() {
    if (this._dirty) {
      this._dirty = false;
      this.xAxis.min = this._bounds.left;
      this.xAxis.min = this._bounds.right - this._frame.width;
      this.xAxis.min = this._bounds.top;
      this.xAxis.min = this._bounds.bottom - this._frame.height;
    }
    if (this._isDown) {
      this.xAxis.hold(this._globalPosition.x);
      this.yAxis.hold(this._globalPosition.y);
    } else {
      this.xAxis.slide(this.disableEasing);
      this.yAxis.slide(this.disableEasing);
    }
  }
  resize(w, h) {
    this._frame.x = 0;
    this._frame.width = w;
    this._frame.y = 0;
    this._frame.height = h;
    this._dirty = true;
  }
  setBounds(minX, maxX, minY, maxY) {
    this._bounds.x = minX;
    this._bounds.width = maxX - minX;
    this._bounds.y = minY;
    this._bounds.height = maxY - minY;
    this._dirty = true;
  }
  get x() {
    return this.xAxis.value;
  }
  get y() {
    return this.yAxis.value;
  }
}
