import { SoundManager } from "../../../soundManager";
import { Tween } from "../../../systems/tween/tween";

export const MusicTimeMode = Object.freeze({
  Follow : "follow",
  Auto   : "auto",
});

export class MusicTime {
  static init(app) {
    this.app = app;
    this._current = 0;
    this._dt = 0;
    this.scale = 0;
    this.songId = null;
    this.mode = MusicTimeMode.Follow;

    this.app.ticker.add(this.update, this);
  }

  static initMusic(songId) {
    this.songId = songId;
  }

  static start() {
    this.scale = 1;
    this.started = true;
  }

  static stop() {
    this.scale = 0;
    this.started = false;
  }

  static pause() {
    this.scale = 0;
  }

  static resume() {
    if (!this.started) {
      return;
    }
    this.scale = 1;
  }

  static update() {
    if (this.mode === MusicTimeMode.Follow) {
      if (!this.songId || this.isRevert) {
        return;
      }
      if (!this.started) {
        this._dt = 0;
        return;
      }
      var songSpriteTime = SoundManager.getDuration(this.songId);
      let current = SoundManager.seek(this.songId) - songSpriteTime;
      this._dt = current - this._current;
      this._current = current;
    }
    else {
      this._dt = this.app.ticker.deltaMS / 1000 * this.scale;
      this._current += this._dt;
    }
  }

  static get dt() {
    return this._dt;
  }

  /**
   * @summary Current time in seconds
   */
  static get current() {
    return this._current;
  }

  /**
   * @summary Current time in miliseconds
   */
  static get currentMS() {
    return this._current * 1000;
  }

  static revert(time, callback = () => {}) {

    this.isRevert = true;
    let targetRevertTime = time;

    Tween.createTween(this, {
      _current: this._current - targetRevertTime,
    }, {
      onComplete: () => {
        this.isRevert = false;
        callback();
      },
    }).start();
    return targetRevertTime;
  }
}
