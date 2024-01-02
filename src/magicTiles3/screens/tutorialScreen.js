import { Sprite, Text, TextStyle, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { SoundManager } from "../../soundManager";
import { AssetSelector } from "../assetSelector";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameSetting } from "../gameSetting";
import { PureRect } from "../../pureDynamic/PixiWrapper/pureRect";
import { Tween } from "../../systems/tween/tween";

export const TutorialScreenEvent = Object.freeze({
  ON_FADE_IN  : "onFadeIn",
  ON_FADE_OUT : "onFadeOut",
});

export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);
    this.isFadeOut = false;
  }

  create() {
    super.create();
    this._initGuideText();
  }

  show() {
    super.show();
    this.isFadeOut = false;
    this.fadeIn();
  }

  resize() {
    super.resize();
  }

  hide() {
    super.hide();
  }

  _initGuideText() {
    let text = "Hold your finger on screen\nto stretch out the stick";

    let pTransform = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      x               : 0,
      y               : 380,
      useOriginalSize : true,
    });
    let lTransform = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      x               : 0,
      y               : 250,
      useOriginalSize : true,
    });

    let pTextStyle = new TextStyle({
      fontFamily  : "Arial",
      fontSize    : 50,
      fill        : "black",
      align       : "center",
      fontWeight  : "bold",
      lineHeight  : 70,
    });
    let lTextStyle = new TextStyle({
      fontFamily  : "Arial",
      fontSize    : 50,
      fill        : "black",
      align       : "center",
      fontWeight  : "bold",
      lineHeight  : 70,
    });

    this.guideText = new PureText(text, pTransform, lTextStyle, lTransform);
    this.guideText.displayObject.alpha = 0;
    this.addChild(this.guideText.displayObject);
  }

  fadeIn() {
    this.fadeInTween = Tween.createTween(this.guideText.displayObject, { alpha: 1 }, {
      duration: 1,
      onComplete: () => {
        this.emit(TutorialScreenEvent.ON_FADE_IN);
      },
    });

    this.fadeInTween.start();
  }

  fadeOut() {
    this.isFadeOut = true;
    this.fadeOutTween = Tween.createTween(this.guideText.displayObject, { alpha: 0 }, {
      duration: 1,
      delay: 0.2,
      onComplete: () => {
        this.emit(TutorialScreenEvent.ON_FADE_OUT);
      },
    });
    this.fadeOutTween.start();
  }

  startGame() {
    GameStateManager.state = GameState.Playing;
  }

}
