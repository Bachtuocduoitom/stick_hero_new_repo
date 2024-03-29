import { ScrollSpring } from "./scrollSpring";

export class SlidingNumber {
  constructor(options = {}) {
    this.position = 0;
    this.constrain = true;
    this.min = 0;
    // the window width of the drag
    this.max = 0;
    // the window width of the drag
    this.maxSpeed = 400;
    this._offset = 0;
    this._prev = 0;
    this._speed = 0;
    this._targetSpeed = 0;
    this._speedChecker = 0;
    this._grab = 0;
    this.constrain = options.constrain ?? true;
    this.maxSpeed = options.maxSpeed ?? 400;
    this._ease = options.ease ?? new ScrollSpring();
  }
  set value(n) {
    this._speed = 0;
    this.position = n;
  }
  get value() {
    return this.position;
  }
  grab(offset) {
    this._grab = offset;
    this._offset = this.position - offset;
    this._speedChecker = 0;
    this._targetSpeed = this._speed = 0;
    this._hasStopped = false;
  }
  hold(newPosition) {
    this._speedChecker++;
    this.position = newPosition + this._offset;
    if (this._speedChecker > 1) {
      this._targetSpeed = this.position - this._prev;
    }
    this._speed += (this._targetSpeed - this._speed) / 2;
    if (this._speed > this.maxSpeed)
      this._speed = this.maxSpeed;
    else if (this._speed < -this.maxSpeed)
      this._speed = -this.maxSpeed;
    this._prev = this.position;
    if (this.constrain) {
      this._activeEase = null;
      if (this.position > this.min) {
        this.position -= (this.position - this.min) / 1.5;
      } else if (this.position < this.max) {
        this.position += (this.max - this.position) / 1.5;
      }
    }
  }
  slide(instant = false) {
    if (this._hasStopped)
      return;
    if (this.constrain) {
      this._updateConstrain(instant);
    } else {
      this._updateDefault();
    }
  }
  get moveAmount() {
    return -(this.position - this._offset - this._grab);
  }
  _updateDefault() {
    this._speed *= 0.9;
    this.position += this._speed;
    if ((this._speed < 0 ? this._speed * -1 : this._speed) < 0.01) {
      this._hasStopped = true;
    }
  }
  _updateConstrain(instant = false) {
    const max = this.max;
    if (instant) {
      if (this.value > 0) {
        this.value = 0;
      }
      if (this.value > 0) {
        this.value = 0;
      }
      if (this.value < this.max) {
        this.value = this.max;
      }
      if (this.value < this.max) {
        this.value = this.max;
      }
    } else if (this.position > this.min || this.position < max || this._activeEase) {
      if (!this._activeEase) {
        this._activeEase = this._ease;
        if (this.position > this.min) {
          this._activeEase.start(this._speed, this.position, this.min);
        } else {
          this._activeEase.start(this._speed, this.position, max);
        }
      }
      this.position = this._activeEase.update();
      if (this._activeEase.done) {
        this.position = this._activeEase.to;
        this._speed = 0;
        this._activeEase = null;
      }
    } else {
      this._updateDefault();
    }
  }
}