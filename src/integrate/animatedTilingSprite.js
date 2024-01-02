import { ObservablePoint, Point, TilingSprite } from "pixi.js";
import { Tween } from "../systems/tween/tween";

export class AnimatedTilingSprite extends TilingSprite {
  constructor(texture) {
    super(texture);
    this._currFrame = 0;
    this._duration = 1;
    this._loop = false;
    this.tile = new ObservablePoint(this._onTileChanged, this, 1, 1);
    this._frameCount = 0;
    this._tileSize = new Point();

    this._onTileChanged();
    this._initTween();
    this._updateTiling();
  }

  _initTween() {
    this._motion = { percent: 0 };
    this._tween = Tween.createTween(this._motion, { percent: 1 }, {
      duration: this.duration,
      onUpdate: this._onTweenUpdate.bind(this),
      onComplete: this._onTweenComplete.bind(this),
      onRepeat: this._onTweenComplete.bind(this),
    });
  }

  play(onComplete) {
    this._onComplete = onComplete;
    this._tween.start();
  }

  pause() {
    this._tween.pause();
  }

  resume() {
    this._tween.resume();
  }

  _onTweenComplete() {
    this._onComplete && this._onComplete();
  }

  _onTweenUpdate() {
    this.frame = Math.floor((this._frameCount - 1) * this._motion.percent);
  }

  _onTileChanged() {
    this._tileSize.x = this.texture.width / this.tile.x;
    this._tileSize.y = this.texture.height / this.tile.y;
    this._frameCount = this.tile.x * this.tile.x;
    this._updateTiling();
  }

  _updateTiling() {
    this.tileScale.x = this.width / this._tileSize.x;
    this.tileScale.y = this.height / this._tileSize.y;
    this.tilePosition.x = -(this.frame % this.tile.x) * this.width;
    this.tilePosition.y = -Math.floor(this.frame / this.tile.x) * this.height;
  }

  get frame() {
    return this._currFrame;
  }

  set frame(frame) {
    if (this._currFrame !== frame) {
      this._currFrame = frame;
      this._updateTiling();
    }
  }

  get duration() {
    return this._duration;
  }

  set duration(value) {
    this._duration = value;
    this._tween.duration(this.duration * 1000);
  }

  get loop() {
    return this._loop;
  }

  set loop(value) {
    this._loop = value;
    this._tween.repeat(this.loop ? Infinity : 0);
  }
}
