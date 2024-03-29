export class Spring {
  constructor(options = {}) {
    this.x = 0;
    this.ax = 0;
    this.dx = 0;
    this.tx = 0;
    this._options = options;
    this._options.max = options.max || 160;
    this._options.damp = options.damp || 0.8;
    this._options.springiness = options.springiness || 0.1;
  }
  update() {
    this.ax = (this.tx - this.x) * this._options.springiness;
    this.dx += this.ax;
    this.dx *= this._options.damp;
    if (this.dx < -this._options.max)
      this.dx = -this._options.max;
    else if (this.dx > this._options.max)
      this.dx = this._options.max;
    this.x += this.dx;
  }
  reset() {
    this.x = 0;
    this.ax = 0;
    this.dx = 0;
    this.tx = 0;
  }
  get max() {
    return this._options.max;
  }
  set max(value) {
    this._options.max = value;
  }
  get damp() {
    return this._options.damp;
  }
  set damp(value) {
    this._options.damp = value;
  }
  get springiness() {
    return this._options.springiness;
  }
  set springiness(value) {
    this._options.springiness = value;
  }
}