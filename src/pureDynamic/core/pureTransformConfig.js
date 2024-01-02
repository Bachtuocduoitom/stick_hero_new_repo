import { PureObject } from "./pureObject";

export class PureTransformConfig {
  constructor() {
    /**
     * @type {PureObject}
     */
    this.container;

    this.alignment = Alignment.CUSTOM;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.anchorX = 0;
    this.anchorY = 0;
    this.pivotX = 0;
    this.pivotY = 0;

    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
    this.maintainAspectRatioType = MaintainAspectRatioType.NONE;

    // display object size before effect by PureObject
    this.naturalWidth = 0;
    this.naturalHeight = 0;

    /**
     * Ignore pivot for some reason (Spine)
     */
    this.ignorePivot = false;

    /**
     * Use percentage unit according to container for the coordinates.
     * A percented coordinate must have value from 0 to 1.
     * If a percented coordinate have value greater than 1, use pixel unit instead.
     */
    this.usePercent = false;

    /**
     * Use the size have been inputted in the first place when update transform
     */
    this.useOriginalSize = false;
  }

  /**
   * @param {PureObject} pureObject
   */
  setup(pureObject) {
    if (!this.naturalWidth) {
      this.naturalWidth = pureObject.displayObject.width;
    }

    if (!this.naturalHeight) {
      this.naturalHeight = pureObject.displayObject.height;
    }

    if (!this.useOriginalSize) {
      if (!this.width && (this.alignment === Alignment.VERTICAL_LEFT || this.alignment === Alignment.VERTICAL_MIDDLE || this.alignment === Alignment.VERTICAL_RIGHT)) {
        this.width = this.naturalWidth;
      }
      else if (!this.height && (this.alignment === Alignment.HORIZONTAL_BOTTOM || this.alignment === Alignment.HORIZONTAL_MIDDLE || this.alignment === Alignment.HORIZONTAL_TOP)) {
        this.height = this.naturalHeight;
      }
      else {
        if (!this.width) {
          this.width = this.naturalWidth;
        }

        if (!this.height) {
          this.height = this.naturalHeight;
        }
      }
    }
  }
}

export const Alignment = Object.freeze({
  // strect alignments
  FULL: "full",
  HORIZONTAL_TOP: "horizontal-top",
  HORIZONTAL_MIDDLE: "horizontal-middle",
  HORIZONTAL_BOTTOM: "horizontal-bottom",
  VERTICAL_LEFT: "vertical-left",
  VERTICAL_MIDDLE: "vertical-middle",
  VERTICAL_RIGHT: "vertical-right",

  // pivot alignments
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  MIDDLE_LEFT: "middle-left",
  MIDDLE_CENTER: "middle-center",
  MIDDLE_RIGHT: "middle-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_RIGHT: "bottom-right",

  CUSTOM: "custom",
});

export const MaintainAspectRatioType = Object.freeze({
  NONE: "none",
  MIN: "min",
  MAX: "max",
});