export class Time {
  static init(app) {
    this.app = app;
    this._current = 0;
    this._dt = 0;
    this.scale = 1;

    this.app.ticker.add(this.update, this);
  }

  static update() {
    this._dt = this.app.ticker.deltaMS / 1000 * this.scale;
    this._current += this._dt;
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
}
