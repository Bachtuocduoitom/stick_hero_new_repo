import { ResponsiveType } from "./responsiveType";
import { GameResizer } from "../systems/gameResizer";

export class ResponsiveNumber {
  /**
   * @class ResponsiveNumber
   * @param {number} original 
   * @param {ResponsiveType} type 
   */
  constructor(original, type) {
    this.original = original;
    this.type = type;
  }

  get value() {
    switch(this.type) {
      case ResponsiveType.Width:
        return this.original * GameResizer.gameScaleX;

      case ResponsiveType.Height:
        return this.original * GameResizer.gameScaleY;
      
      case ResponsiveType.Min:
        return this.original * Math.min(GameResizer.gameScaleX, GameResizer.gameScaleY);

      case ResponsiveType.Max:
        return this.original * Math.max(GameResizer.gameScaleX, GameResizer.gameScaleY);

      case ResponsiveType.Ratio:
        return this.original * (GameResizer.canvas.width / GameResizer.canvas.height);

      case ResponsiveType.None:
      default:
        return this.original;
    }
  }
}
