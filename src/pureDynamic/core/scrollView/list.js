import { Container } from "pixi.js";

export default class List extends Container {
  constructor(options) {
    super();
    /** Returns all arranged elements. */
    this.children = [];
    if (options) {
      this.init(options);
    }
    options?.items?.forEach((item) => this.addChild(item));
    this.on("added", () => this.arrangeChildren());
    this.on("childAdded", () => this.arrangeChildren());
  }
  /**
   * Initiates list component.
   * @param options
   */
  init(options) {
    this.options = options;
    if (options?.type) {
      this.type = options.type;
    }
    if (options?.children) {
      options.children.forEach((child) => this.addChild(child));
    }
  }
  /**
   * Set items arrange direction.
   * @param type - Arrange direction.
   */
  set type(type) {
    this._type = type;
    this.arrangeChildren();
  }
  /**
   * Get items arrange direction.
   * @returns Arrange direction.
   */
  get type() {
    return this._type;
  }
  /**
   * Set element margin.
   * @param margin - Margin between elements.
   */
  set elementsMargin(margin) {
    this.options.elementsMargin = margin;
    this.arrangeChildren();
  }
  /**
   * Get element margin.
   * @returns Margin between elements.
   */
  get elementsMargin() {
    return this.options.elementsMargin;
  }
  /**
   * Set vertical padding.
   * @param padding - Vertical padding between list border and its elements.
   */
  set vertPadding(padding) {
    this.options.vertPadding = padding;
    this.arrangeChildren();
  }
  /**
   * Get vertical padding.
   * @returns Vertical padding between list border and its elements.
   */
  get vertPadding() {
    return this.options.vertPadding;
  }
  /**
   * Set horizontal padding.
   * @param padding - Horizontal padding between list border and its elements.
   */
  set horPadding(padding) {
    this.options.horPadding = padding;
    this.arrangeChildren();
  }
  /**
   * Get horizontal padding.
   * @returns Horizontal padding between list border and its elements.
   */
  get horPadding() {
    return this.options.horPadding;
  }
  /**
   * Arrange all elements basing in their sizes and component options.
   * Can be arranged vertically, horizontally or bidirectional.
   */
  arrangeChildren() {
    let x = this.options?.horPadding ?? 0;
    let y = this.options?.vertPadding ?? 0;
    const elementsMargin = this.options?.elementsMargin ?? 0;
    let maxWidth = this.parent?.width;
    if (this.options?.horPadding) {
      maxWidth -= this.options.horPadding;
    }
    this.children.forEach((child, id) => {
      switch (this.type) {
        case ListType.VERTICAL:
          child.y = y;
          child.x = x;
          y += elementsMargin + child.height;
          break;
        case ListType.HORIZONTAL:
          child.x = x;
          child.y = y;
          x += elementsMargin + child.width;
          break;
        default:
          child.x = x;
          child.y = y;
          if (child.x + child.width >= maxWidth && id > 0) {
            y += elementsMargin + child.height;
            x = this.options?.horPadding ?? 0;
            child.x = x;
            child.y = y;
          }
          x += elementsMargin + child.width;
          break;
      }
    });
  }
}

export const ListType = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
}
