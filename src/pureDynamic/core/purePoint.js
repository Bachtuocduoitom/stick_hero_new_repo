export class PurePoint {
  /**
   * @class Point
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {number} x 
   * @param {number} y If y undefined, set y = x.
   */
  set(x = 0, y = undefined) {
    if (y === undefined) {
      this.x = this.y = x;
    } else {
      this.x = x;
      this.y = y;
    }
  }
}
