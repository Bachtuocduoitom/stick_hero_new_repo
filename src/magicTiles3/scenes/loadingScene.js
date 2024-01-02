import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { GameConstant } from "../../gameConstant";
import { GameStateManager, GameState } from "../../pureDynamic/systems/gameStateManager";
import { SceneManager } from "../../pureDynamic/PixiWrapper/scene/sceneManager";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { SoundManager } from "../../soundManager";
import { LoadingBar, LoadingBarEvent } from "../gameObjects/progress/LoadingBar";
import { DataLocal, DataLocalState } from "../data/dataLocal";
import { Texture } from "pixi.js";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { LoadingScreen, LoadingScreenEvent } from "../screens/loadingScreen";

export const LoadingSceneEvent = Object.freeze({
  LoadCompleted: "loadComplete",
});

export class LoadingScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_LOADING);
    GameResizer.registerOnResizeCallback(this.resize.bind(this));
    this.resize();
  }

  resize() {
  }

  reset() {

  }

  update(dt) {
    super.update(dt);
  }

  create() {
    super.create();
    this.ui.addScreens(new LoadingScreen());
    this.loadingScreen = this.ui.getScreen(GameConstant.SCREEN_LOADING);
    this.loadingScreen.on(LoadingScreenEvent.LoadingbarCompleted, this.startGame, this);
    this.ui.setScreenActive(GameConstant.SCREEN_LOADING);
  }

  startGame() {
    SoundManager.play("click");
    GameStateManager.state = GameState.Home;
    this.emit(LoadingSceneEvent.LoadCompleted, this);
    SceneManager.unload(this);
  }

  displayBackground() {
    this.portraitBg.visible = false;
    this.landscapeBg.visible = false;
    this.bg = GameResizer.isPortrait() ? this.portraitBg : this.landscapeBg;
    this.bg.visible = true;
  }

  _onGameResized() {
    super._onGameResized();
    // this.displayBackground();
  }

  destroy() {
    super.destroy();
  }

  _initBackground() {
    let bgPortraitTexture = Texture.from("bg_endcard_portrait");
    let portraitTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.portraitBg = new PureSprite(bgPortraitTexture, portraitTransform);
    this.addChild(this.portraitBg.displayObject);

    let bgLandscapeTexture = Texture.from("bg_endcard_landscape");
    let landscapeTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.landscapeBg = new PureSprite(bgLandscapeTexture, landscapeTransform);
    this.addChild(this.landscapeBg.displayObject);
  }

  _initScoreText() {
    let transform = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      y               : 120,
      useOriginalSize : true,
    });
    let style = new PIXI.TextStyle({
      fontSize : 70,
      align    : "center",
      fill     : 0xFFFFFF,
    });
    this.txtScore = new PureText("0", transform, style);
    this.addChild(this.txtScore.displayObject);
  }
}
