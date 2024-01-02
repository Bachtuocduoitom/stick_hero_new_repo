import { GameConstant } from "../../gameConstant";
import { PureObject } from "../core/pureObject";
import * as EventEmitter from "events";

export class GameResizer {

  /**
   * @param {PIXI.Application} app 
   */
  static init(app) {
    this.app = app;
    this.canvas = this.app.view;
    this.app.resizeTo = this.canvas;
    this.mode = ResizeMode.FullScale;
    this.lastResize = { width: this.canvas.width, height: this.canvas.height }; // canvas width and height before resize

    this.emitter = new PIXI.utils.EventEmitter();
  }

  static resize(windowWidth = 0, windowHeight = 0) {
    this.windowWidth = windowWidth || this.canvas.width;
    this.windowHeight = windowHeight || this.canvas.height;
    this._resizeFullScale();
    this.app.resize();
    this.emitter.emit("onresize");
    this.emitter.emit("onresized");
  }

  static _resizeFullScale() {
    let style = this.canvas.style;

    console.log(`--- Enter resize ${this.mode}`);
    console.log(`Window: ${this.windowWidth}x${this.windowHeight}`);

    this.orientation = this.windowWidth <= this.windowHeight ? Orientation.Portrait : Orientation.Landscape;

    let ratio = 1;
    if (this.orientation === Orientation.Portrait) {
      ratio = GameConstant.GAME_WIDTH / this.windowWidth;
    }
    else {

      // ratio = Math.max(GameConstant.GAME_WIDTH / this.windowWidth, GameConstant.GAME_HEIGHT / this.windowHeight);
      ratio = GameConstant.GAME_WIDTH / this.windowHeight;
    }

    this.width = this.windowWidth * ratio;
    this.height = this.windowHeight * ratio;

    console.log(`Resize to: ${this.width}x${this.height} orientation: ${this.orientation}`);
    this.lastResize.width = this.canvas.width;
    this.lastResize.height = this.canvas.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.gameScaleX = this.canvas.width / GameConstant.GAME_WIDTH;
    this.gameScaleY = this.canvas.height / GameConstant.GAME_HEIGHT;

    let scale = this.windowWidth / this.width;

    style.transformOrigin = "0px 0px";
    style.transform = `scale(${scale})`;

    let vMargin = Math.floor((this.windowWidth - this.width * scale) / 2);
    let hMargin = Math.floor((this.windowHeight - this.height * scale) / 2);

    style.margin = `${hMargin}px ${vMargin}px ${hMargin}px ${vMargin}px`;
  }

  static registerOnResizeCallback(fn, context) {
    this.emitter.on("onresize", fn, context);
  }

  static unregisterOnResizeCallback(fn, context) {
    this.emitter.off("onresize", fn, context);
  }

  static registerOnResizedCallback(fn, context) {
    this.emitter.on("onresized", fn, context);
  }

  static unregisterOnResizedCallback(fn, context) {
    this.emitter.off("onresized", fn, context);
  }

  static isPortrait() {
    return this.orientation === Orientation.Portrait;
  }

  static isLandScape() {
    return this.orientation === Orientation.Landscape;
  }
}

export const Orientation = Object.freeze({
  Portrait: "portrait",
  Landscape: "landscape",
});

export const ResizeMode = Object.freeze({
  LetterBox: "letterbox",
  FullScale: "fullscale",
});