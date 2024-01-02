import { utils } from "pixi.js";
import { Time } from "../time/time";

export class ScriptSystem {
  static init(app) {
    this.app = app;
    this.emitter = new utils.EventEmitter();

    this.app.ticker.add(this._update, this);
  }

  static _update() {
    this.emitter.emit("update");
  }

  static scriptUpdate() {
    if (this.displayObject.worldVisible) {
      if (!this.enabled) {
        this.enable();
      }
    }
    else {
      this.disable();
    }

    if (this.displayObject.worldVisible && this.enable) {
      this.update(Time._dt);
    }
  }
}
