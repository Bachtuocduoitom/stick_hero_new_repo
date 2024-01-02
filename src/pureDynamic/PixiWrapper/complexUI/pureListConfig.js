import { Util } from "../../../helpers/utils";

export class PureListConfig {
  /**
   * @param {PureListConfig} source Copy properties from this object. Useful for shorthand declaration: new PureListConfig({ axisType: AxisType.Horizontal })
   */
  constructor(source = undefined) {
    this.axisType = AxisType.Horizontal;
    this.spacing = 0;

    // resize items to fit list object size
    this.controlWidth = false;
    this.controlHeight = false;

    // expand items position to fit list object size
    this.expand = false

    // centering items position
    this.centerX = false;
    this.centerY = false;

    // padding
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;

    this.maintainItemRatio = false;

    if (source) {
      Util.copyObject(this, source);
    }
  }
}

export const AxisType = Object.freeze({
  Horizontal: "horizontal",
  Vertical: "vertical",
});
