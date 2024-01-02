import { utils } from "pixi.js";

export class Script extends utils.EventEmitter {

  /**
   * @class Script
   * @param displayObject displayObject contain this script
   */
  constructor(name) {
    super();
    this.name = name;
    this.enabled = false;
    this._initialized = false;
  }

  initialize() {
  }

  /**
   * @readonly should not be modified or called if it is overwritten
   */
  enable() {
    this.enabled = true;
    this.onEnable();
    this.emit("enable");
  }

  /**
   * @readonly should not be modified or called if it is overwritten
   */
  disable() {
    this.enabled = false;
    this.onDisable();
    this.emit("disable");
  }

  destroy() {
    this.onDestroy();
    this.emit("destroy");
  }

  /**
   * This function will be called when Script is added to a DisplayObject
   */
  onEnable() {
  }

  /**
   * This function will be called when app update and Scripts are visible and enabled
   * @param {float} dt delta time
   */
  // eslint-disable-next-line no-unused-vars
  update(dt) {
  }

  onDisable() {
  }

  /**
   * This function will be called when displayObject destroy
   */
  onDestroy() {
  }
}
