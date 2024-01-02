import { Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { DataLocal, DataLocalState } from "../data/dataLocal";
import { LoadingBar, LoadingBarEvent } from "../gameObjects/progress/LoadingBar";
import { Time } from "../../systems/time/time";
export const LoadingScreenEvent = Object.freeze({
  LoadingbarCompleted: "LoadingbarCompleted",
});
export class LoadingScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOADING);
  }

  create() {
    super.create();
    this._initBackground();
    this._initABILogo();
    this.initLoadingbar();
  }

  show() {
    super.show();
    this.increase = 0;
  }

  hide() {
    super.hide();
  }

  _initABILogo() {
    let texture = Texture.from("spr_abi_logo");
    let portraitTransform = new PureTransform({
      alignment : Alignment.MIDDLE_CENTER,
      y         : -100,
      width     : texture.width,
      height    : texture.height,
    });

    let lTransform = new PureTransform({
      alignment : Alignment.MIDDLE_CENTER,
      y         : -200,
      width     : texture.width * 2,
      height    : texture.height * 2,
    });

    this.abiLogo = new PureSprite(texture, portraitTransform, lTransform);
    this.addChild(this.abiLogo.displayObject);
  }

  _initBackground() {
    let texture = Texture.from("bg_portrait");
    let portraitTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(texture, portraitTransform);
    this.addChild(this.bg.displayObject);
  }

  update(dt) {
    super.update(dt);
    if (!this.loadingBar.started) {
      return;
    }
    this.increase += Time._dt;
    if (this.increase >= 0.9 && DataLocal.state === DataLocalState.Loading) {
      this.increase = 0.9;
      return;
    }
    this.loadingBar.updateProgress(this.increase);
    this.emit(LoadingBarEvent.PROGRESSING, this.increase);
    if (this.increase >= 1) {
      this.onLoadingCompleted();
      this.loadingBar.started = false;
    }

  }

  initLoadingbar() {
    this.loadingBar = new LoadingBar();
    this.addChild(this.loadingBar);

    this.loadingBar.reset();
    this.loadingBar.start();
  }

  onLoadingCompleted() {
    this.emit(LoadingScreenEvent.LoadingbarCompleted, this);
  }
}
