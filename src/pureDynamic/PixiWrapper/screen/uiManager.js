import { Container } from "pixi.js";
import { GameConstant } from "../../../gameConstant";

export class UIManager extends Container {
  constructor() {
    super("ui_manager");
    /** @type {Array<UIScreen>} */
    this.screens = [];
  }

  update(dt) {
    this.screens.forEach((screen) => screen.visible && screen.update(dt));
  }

  pause() {
    this.screens.forEach((screen) => screen.visible && screen.pause());
  }

  resume() {
    this.screens.forEach((screen) => screen.visible && screen.resume());
  }

  /**
   * @param {...UIScreen} screens
   */
  addScreens(...screens) {
    screens.forEach((screen) => {
      this.addChild(screen);
      this.screens.push(screen);
    });
  }

  /**
   * @param {...string} keys
   */
  removeScreen(...keys) {
    keys.forEach((key) => {
      let screen = this.getScreen(key);
      if (screen) {
        this.screens.splice(screen, 1);
      }
    });
  }

  /**
   * @param {string} key
   */
  setScreenActive(key, isActive = true) {
    let screen = this.getScreen(key);
    if (screen) {
      if (!screen.created) {
        screen.create();
      }
      if (isActive) {
        screen.show();
      }
      else {
        screen.hide();
      }
    }
    else if (GameConstant.DEBUG_ON) {
      console.warn(`Screen ${key} not found!`);
    }
  }

  disableAllScreens() {
    this.screens.forEach((screen) => screen.visible = false);
  }

  getScreen(key) {
    return this.screens.find((screen) => screen.key === key);
  }

  resize() {
    this.screens.forEach((screen) => screen.visible && screen.resize());
  }
}
