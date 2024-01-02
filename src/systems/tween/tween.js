import TWEEN from "@tweenjs/tween.js";
import { Util } from "../../helpers/utils";
import { Time } from "../time/time";
import { Tweener } from "./tweener";

export class Tween {
  static defaultConfig = Object.freeze({
    duration    : 1,
    easing      : TWEEN.Easing.Linear.None,
    loop        : false,
    yoyo        : false,
    delay       : 0,
    repeatDelay : 0,
    repeat      : 0,
    onStart     : () => { },
    onRepeat    : () => { },
    onStop      : () => { },
    onUpdate    : () => { },
    onComplete  : () => { },
  });

  /**
   * @param {PIXI.Application} app
   */
  static init(app) {
    app.ticker.add(this.update, this);
  }

  static update() {
    TWEEN.update(Time.currentMS);
  }

  static createCountTween(config = Tween.defaultConfig) {
    return this.createTween({ percent: 0 }, { percent: 1 }, config);
  }

  static createTween(target, dest = {}, config = Tween.defaultConfig) {
    let tweenConfig = this._setupConfig(config);
    let tween = new Tweener(target);
    tween.to(dest, tweenConfig.duration * 1000);
    this._setupTween(tween, tweenConfig);
    return tween;
  }

  static _setupConfig(config) {
    return Util.copyObject(config, Util.copyObject(Tween.defaultConfig));
  }

  static _setupTween(tween, config) {
    tween.delay(config.delay * 1000);
    tween.repeatDelay(config.repeatDelay * 1000);
    if (config.loop) {
      tween.repeat(Infinity);
    }
    else {
      tween.repeat(config.repeat);
    }
    tween.yoyo(config.yoyo);
    tween.easing(config.easing);
    tween.onStart(config.onStart);
    tween.onRepeat(config.onRepeat);
    tween.onStop(config.onStop);
    tween.onUpdate(config.onUpdate);
    tween.onComplete(config.onComplete);
  }

  static get Easing() {
    return TWEEN.Easing;
  }
}
