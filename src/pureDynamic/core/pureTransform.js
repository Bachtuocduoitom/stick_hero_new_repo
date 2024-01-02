import { PureTransformConfig, MaintainAspectRatioType, Alignment } from "./pureTransformConfig";
import { GameResizer } from "../systems/gameResizer";
import { Util } from "../../helpers/utils";
import { PurePoint } from "./purePoint";
import { PureObject } from "./pureObject";

export class PureTransform {
  /**
   * @class PureTransform 
   * @param {PureTransformConfig} config
   */
  constructor(config = null) {
    this.config = new PureTransformConfig();
    if (config) {
      Util.copyObject(config, this.config);
    }
  }

  /**
   * @param {PureObject} pureObject 
   */
  setup(pureObject) {
    this.pureObject = pureObject;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.pivot = new PurePoint(0, 0);
    this.anchor = new PurePoint(0, 0);
    this.config.setup(pureObject);

    if (this.config.usePercent) {
      this.percent = {
        x: this.config.x,
        y: this.config.y,
        width: this.config.width,
        height: this.config.height,
        top: this.config.top,
        bottom: this.config.bottom,
        left: this.config.left,
        right: this.config.right,
      }
    }
  }

  updateConfig() {
    let container = this.config.container;
    if (container) {
      let bound = this._getContainerBound(container);
      this._containerX = bound.x;
      this._containerY = bound.y;
      this._containerWidth = bound.width;
      this._containerHeight = bound.height;
    } else {
      this._containerX = 0;
      this._containerY = 0;
      this._containerWidth = GameResizer.width;
      this._containerHeight = GameResizer.height;
    }

    if (this.config.usePercent) {
      this._percentToPixel();
    }

    this._updateAlignment();

    if (this.config.maintainAspectRatioType !== MaintainAspectRatioType.NONE) {
      this._maintainAspectRatio();
    }

    this.angle = this.config.angle;
  }

  _getContainerBound(container) {
    let x = container.x;
    let y = container.y;
    let width = container.width;
    let height = container.height;
    let anchor = container.displayObject.anchor;
    if (anchor) {
      x -= width * anchor.x;
      y -= height * anchor.y;
    }
    return { x, y, width, height };
  }

  _percentToPixel() {
    this.config.x = this._getValueByPercent(this.percent.x, this._containerWidth);
    this.config.y = this._getValueByPercent(this.percent.y, this._containerHeight);
    this.config.width = this._getValueByPercent(this.percent.width, this._containerWidth);
    this.config.height = this._getValueByPercent(this.percent.height, this._containerHeight);
    this.config.top = this._getValueByPercent(this.percent.top, this._containerHeight);
    this.config.bottom = this._getValueByPercent(this.percent.bottom, this._containerHeight);
    this.config.left = this._getValueByPercent(this.percent.left, this._containerWidth);
    this.config.right = this._getValueByPercent(this.percent.right, this._containerWidth);
  }

  _getValueByPercent(percent, max) {
    if (this._isPercent(percent)) {
      return percent * max;
    }
    return percent;
  }

  _isPercent(value) {
    return Math.abs(value) >= 0 && Math.abs(value) <= 1;
  }

  _updateAlignment() {
    switch (this.config.alignment) {
      case Alignment.FULL:
        this._alignFull();
        break;
      case Alignment.HORIZONTAL_TOP:
        this._alignHorizontalTop();
        break;
      case Alignment.HORIZONTAL_MIDDLE:
        this._alignHorizontalMiddle();
        break;
      case Alignment.HORIZONTAL_BOTTOM:
        this._alignHorizontalBottom();
        break;
      case Alignment.VERTICAL_LEFT:
        this._alignVerticalLeft();
        break;
      case Alignment.VERTICAL_MIDDLE:
        this._alignVerticalMiddle();
        break;
      case Alignment.VERTICAL_RIGHT:
        this._alignVerticalRight();
        break;
      case Alignment.TOP_LEFT:
        this._alignCustom(0, 0, 0, 0);
        break;
      case Alignment.TOP_CENTER:
        this._alignCustom(0.5, 0, 0.5, 0);
        break;
      case Alignment.TOP_RIGHT:
        this._alignCustom(1, 0, 1, 0);
        break;
      case Alignment.MIDDLE_LEFT:
        this._alignCustom(0, 0.5, 0, 0.5);
        break;
      case Alignment.MIDDLE_CENTER:
        this._alignCustom(0.5, 0.5, 0.5, 0.5);
        break;
      case Alignment.MIDDLE_RIGHT:
        this._alignCustom(1, 0.5, 1, 0.5);
        break;
      case Alignment.BOTTOM_LEFT:
        this._alignCustom(0, 1, 0, 1);
        break;
      case Alignment.BOTTOM_CENTER:
        this._alignCustom(0.5, 1, 0.5, 1);
        break;
      case Alignment.BOTTOM_RIGHT:
        this._alignCustom(1, 1, 1, 1);
        break;
      case Alignment.CUSTOM:
        let { anchorX, anchorY, pivotX, pivotY } = this.config;
        this._alignCustom(pivotX, pivotY, anchorX, anchorY);
        break;
      default:
        break;
    }
  }

  _alignCustom(pivotX, pivotY, anchorX, anchorY) {
    this.pivot.set(pivotX, pivotY);
    this.anchor.set(anchorX, anchorY);

    let { width, height, x, y } = this.config;
    this.width = width;
    this.height = height;
    this.x = x + this._containerX + this._containerWidth * this.anchor.x;
    this.y = y + this._containerY + this._containerHeight * this.anchor.y;
  }

  _maintainAspectRatio() {
    let scale = 1;
    if (this.config.maintainAspectRatioType === MaintainAspectRatioType.MIN) {
      scale = Math.min(this.width / this.config.naturalWidth, this.height / this.config.naturalHeight);
    } else if (this.config.maintainAspectRatioType === MaintainAspectRatioType.MAX) {
      scale = Math.max(this.width / this.config.naturalWidth, this.height / this.config.naturalHeight);
    }
    this.width = this.config.naturalWidth * scale;
    this.height = this.config.naturalHeight * scale;
  }

  _alignFull() {
    this.pivot.set(0.5);

    let { top, bottom, left, right } = this.config;
    this.width = this._containerWidth - left - right;
    this.height = this._containerHeight - top - bottom;
    this.x = this._containerX + (this._containerWidth + (left - right)) / 2;
    this.y = this._containerY + (this._containerHeight + (top - bottom)) / 2;
  }

  _alignHorizontalTop() {
    this.pivot.set(0.5, 0);

    let { left, right, y, height } = this.config;
    this.width = this._containerWidth - left - right;
    this.height = height;
    this.x = this._containerX + (this._containerWidth + (left - right)) / 2;
    this.y = this._containerY + y;
  }

  _alignHorizontalMiddle() {
    this.pivot.set(0.5);

    let { left, right, y, height } = this.config;
    this.width = this._containerWidth - left - right;
    this.height = height;
    this.x = this._containerX + (this._containerWidth + (left - right)) / 2;
    this.y = this._containerY + this._containerHeight / 2 + y;
  }

  _alignHorizontalBottom() {
    this.pivot.set(0.5, 1);

    let { left, right, y, height } = this.config;
    this.width = this._containerWidth - left - right;
    this.height = height;
    this.x = this._containerX + (this._containerWidth + (left - right)) / 2;
    this.y = this._containerY + this._containerHeight + y;
  }

  _alignVerticalLeft() {
    this.pivot.set(0, 0.5);

    let { x, width, top, bottom } = this.config;
    this.width = width;
    this.height = this._containerHeight - top - bottom;
    this.x = this._containerX + x;
    this.y = this._containerY + (this._containerHeight + (top - bottom)) / 2;
  }

  _alignVerticalMiddle() {
    this.pivot.set(0.5, 0.5);

    let { x, width, top, bottom } = this.config;
    this.width = width;
    this.height = this._containerHeight - top - bottom;
    this.x = this._containerX + this._containerWidth / 2 + x;
    this.y = this._containerY + (this._containerHeight + (top - bottom)) / 2;
  }

  _alignVerticalRight() {
    this.pivot.set(1, 0.5);

    let { x, width, top, bottom } = this.config;
    this.width = width;
    this.height = this._containerHeight - top - bottom;
    this.x = this._containerX + this._containerWidth + x;
    this.y = this._containerY + (this._containerHeight + (top - bottom)) / 2;
  }
}