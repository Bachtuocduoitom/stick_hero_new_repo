export class InputManager {
  /**
   * @class InputManager
   * @param {HTMLCanvasElement} canvas 
   */
  static init(canvas) {
    this.canvas = canvas;
    this.emitter = new PIXI.utils.EventEmitter();
    this._registerDOMEvents();
  }

  static _registerDOMEvents() {
    document.addEventListener("touchstart", e => this._handleTouchEvent(e, this._mouseDownEventHandler.bind(this)), { passive: false });
    document.addEventListener("touchmove", e => this._handleTouchEvent(e, this._mouseMoveEventHandler.bind(this)), { passive: false });
    document.addEventListener("touchend", e => this._handleTouchEvent(e, this._mouseUpEventHandler.bind(this)), { passive: false });

    document.addEventListener("mousedown", e => this._mouseDownEventHandler(e));
    document.addEventListener("mousemove", e => this._mouseMoveEventHandler(e));
    document.addEventListener("mouseup", e => this._mouseUpEventHandler(e));
  }

  /**
   * @param {TouchEvent} evt 
   * @param {(evt: Touch) => void} callback 
   */
  static _handleTouchEvent(evt, callback) {
    evt.preventDefault();
    callback(evt.touches[0]);
  }

  /**
   * @param {Touch} evt 
   */
  static _mouseDownEventHandler(evt) {
    let pos = this.getCanvasMousePos(evt);
    this.isMouseDown = true;
    this.mouseX = pos.x;
    this.mouseY = pos.y;
    this.startMouseX = this.mouseX;
    this.emitter.emit(InputEvent.MouseDown, this.mouseX, this.mouseY);
  }

  /**
   * @param {Touch} evt 
   */
  static _mouseMoveEventHandler(evt) {
    let pos = this.getCanvasMousePos(evt);
    this.mouseX = pos.x;
    this.mouseY = pos.y;
    this.emitter.emit(InputEvent.MouseMove, this.mouseX, this.mouseY, this.startMouseX);
  }

  static _mouseUpEventHandler() {
    this.isMouseDown = false;
    this.emitter.emit(InputEvent.MouseUp, this.mouseX, this.mouseY, this.startMouseX);
  }

  /**
   * @param {Touch} evt 
   */
  static getCanvasMousePos(evt) {
    let bound = this.canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - bound.left) * this.canvas.width / bound.width,
      y: (evt.clientY - bound.top) * this.canvas.height / bound.height
    }
  }

  /**
   * @param {string} event 
   * @param {(mouseX?: number, mouseY?: number, startMouseX?: number)} callback 
   */
  static registerEvent(event, callback) {
    this.emitter.on(event, callback);
  }

  /**
   * @param {string} event 
   * @param {(mouseX?: number, mouseY?: number, startMouseX?: number)} callback 
   */
  static removeEvent(event, callback) {
    this.emitter.off(event, callback)
  }
}

/**
 * @enum InputEvent 
 */
export const InputEvent = Object.freeze({
  MouseDown: "mousedown",
  MouseMove: "mousemove",
  MouseUp: "mouseup"
});