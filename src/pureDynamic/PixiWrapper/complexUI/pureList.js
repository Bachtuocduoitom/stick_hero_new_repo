import { PureRect } from "../pureRect";
import { PureTransform } from "../../core/pureTransform";
import { PureObject } from "../../core/pureObject";
import { AxisType, PureListConfig } from "./pureListConfig";
import { GameResizer, Orientation } from "../../systems/gameResizer";

export class PureList extends PureRect {
  /**
   * @class PureContainer
   * @param {PureListConfig} configPortrait 
   * @param {PureTransform} transformPortrait 
   * @param {PureListConfig} configLandscape 
   * @param {PureTransform} transformLandscape 
   */
  constructor(configPortrait = undefined, transformPortrait = undefined, configLandscape = undefined, transformLandscape = undefined) {
    super(transformPortrait, transformLandscape);
    this.configPortrait = configPortrait ? configPortrait : new PureListConfig();
    this.configLandscape = configLandscape ? configLandscape : this.configPortrait;

    /**
     * @type {Array<PureObject>}
     */
    this.items = [];
    this.registerOnUpdateTransformCallback(this.onResizeContainer.bind(this));
    this.onResizeContainer();
  }

  onResizeContainer() {
    this.config = GameResizer.orientation === Orientation.Portrait ? this.configPortrait : this.configLandscape;
    this.updateItems();
  }

  /**
   * @param {Array<PureObject>} items 
   */
  addItems(...items) {
    items.forEach(item => {
      item.updateTransformManually = true;
      this.items.push(item);
    });
    this.updateItems();
  }

  updateItems() {
    if (this.items.length <= 0) {
      return;
    }

    if (this.config.axisType === AxisType.Horizontal) {
      this.updateItems_Horizontal();
    } else if (this.config.axisType === AxisType.Vertical) {
      this.updateItems_Vertical();
    } else {
      console.error("Invalid Axis Type");
    }
  }

  updateItems_Horizontal() {
    let x = this.x + this.config.left;
    this.items.forEach(item => {
      this.resizeItem(item);

      if (this.config.centerY) {
        item.y = this.y + this.height / 2 - item.height / 2;
      } else {
        item.y = this.y + this.config.top;
      }

      item.x = x;
      x += item.width + this.config.spacing;
    });

    if (this.config.expand) {
      this.expandItems_Horizontal();
    }

    if (this.config.centerY) {
      this.centerItems_Horizontal();
    }
  }

  updateItems_Vertical() {
    let y = this.y + this.config.top;
    this.items.forEach(item => {
      this.resizeItem(item);

      if (this.config.centerX) {
        item.x = this.x + this.width / 2 - item.width / 2;
      } else {
        item.x = this.x + this.config.left;
      }

      item.y = y;
      y += item.height + this.config.spacing;
    });

    if (this.config.expand) {
      this.expandItems_Vertical();
    }

    if (this.config.centerY) {
      this.centerItems_Vertical();
    }
  }

  /**
   * @param {PureObject} item 
   */
  resizeItem(item) {
    let naturalWidth = item.transform.config.naturalWidth;
    let naturalHeight = item.transform.config.naturalHeight;
    let width = item.transform.config.naturalWidth;
    let height = item.transform.config.naturalHeight;

    // calculate spacing
    const spacing = this.config.spacing;
    const totalSpacing = spacing * (this.items.length - 1);

    // calculate control width and height for using controlWith and controlHeight flags
    if (this.config.axisType === AxisType.Vertical) {
      if (this.config.controlWidth) {
        width = this.width - this.config.right - this.config.left;
      }

      if (this.config.controlHeight) {
        height = (this.height - totalSpacing - this.config.top - this.config.bottom) / this.items.length;
      }
    }
    else if (this.config.axisType === AxisType.Horizontal) {
      if (this.config.controlWidth) {
        width = (this.width - totalSpacing - this.config.left - this.config.right) / this.items.length;
      }

      if (this.config.controlHeight) {
        height = this.height - this.config.top - this.config.bottom;
      }
    }

    // maintain aspect ratio
    if (this.config.maintainItemRatio) {
      const ratio = Math.min(width / naturalWidth, height / naturalHeight);
      width = naturalWidth * ratio;
      height = naturalHeight * ratio;
    }

    item.width = width;
    item.height = height;
  }

  centerItems_Horizontal() {
    const spacing = this.config.spacing;
    const totalSpacing = spacing * (this.items.length - 1);
    const totalItemsWidth = this.getTotalItemsWidth();

    // total width of all items and spacing between them
    const contentWidth = totalItemsWidth + totalSpacing;

    let x = this.x + (this.width - contentWidth) / 2;
    this.items.forEach(item => {
      item.x = x;
      x += item.width + spacing;
    })
  }

  /**
   * @summary centering items by Y-axis
   */
  centerItems_Vertical() {
    const spacing = this.config.spacing;
    const totalSpacing = spacing * (this.items.length - 1);
    const totalItemsHeight = this.getTotalItemsHeight();

    // total height of all items and spacing between them
    const contentHeight = totalItemsHeight + totalSpacing;

    let y = this.y + (this.height - contentHeight) / 2;
    this.items.forEach(item => {
      item.y = y;
      y += item.height + spacing;
    });
  }

  /**
   * @summary update items position X to fit list object size
   */
  expandItems_Horizontal() {
    const totalItemsWidth = this.getTotalItemsWidth();
    const totalSpacing = this.width - totalItemsWidth;
    const spacing = totalSpacing / (this.items.length - 1);
    let x = this.x;
    this.items.forEach(item => {
      item.x = x;
      item += item.width + spacing;
    });
  }

  /**
   * @summary update items position Y to fit list object size
   */
  expandItems_Vertical() {
    const totalItemsHeight = this.getTotalItemsHeight();
    const totalSpacing = this.height - totalItemsHeight;
    const spacing = totalSpacing / (this.items.length - 1);
    let y = this.y;
    this.items.forEach(item => {
      item.y = y;
      y += item.height + spacing;
    });
  }

  getTotalItemsWidth() {
    let totalItemsWidth = 0;
    this.items.forEach(item => totalItemsWidth += item.width);
    return totalItemsWidth;
  }

  /**
   * @summary total height of all items
   */
  getTotalItemsHeight() {
    let totalItemsHeight = 0;
    this.items.forEach(item => totalItemsHeight += item.height);
    return totalItemsHeight;
  }
}
