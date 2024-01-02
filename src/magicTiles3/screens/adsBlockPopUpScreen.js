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
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";

export const AdsBlockPopUpScreenEvent = Object.freeze({
  ON_FADE_IN  : "onFadeIn",
  ON_FADE_OUT : "onFadeOut",
});

export class AdsBlockPopUpScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_ADS_BLOCK_POPUP);
    this._initPopUp();
  }

  create() {
    super.create();
  }

  show() {
    super.show();
    this.fadeIn();
  }

  resize() {
    super.resize();
  }

  hide() {
    super.hide();
  }

  _initPopUp() {
    let texture = Texture.from("spr_black_box");
    let pTransform = new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x: 0,
      y: 0,
      width :texture.width,
      height :texture.height,
    });
    let lTransform = new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x: 0,
      y: 0,
      width :texture.width * 0.6,
      height :texture.height * 0.6,
    });
    this.bg = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.bg.displayObject);

    let text = "";

    this.textPopUp = new Text(text, {
      fontFamily: "Arial",
      fontSize: 60,
      fill: "white",
      align: "center",
      lineHeight: 70,
    });
    this.textPopUp.position.set(0, 0);
    this.textPopUp.anchor.set(0.5, 0.5);
    this.bg.displayObject.addChild(this.textPopUp);

  }

  typeAdsInvalid() {
    this.textPopUp.text = "Ads is not available!";
  }

  typeAdsBlock() {
    this.textPopUp.text = "Ads is blocked!";
  }

  typeSkipReward() {
    this.textPopUp.text = "Reward is not received!";
  }

  fadeIn() {
    this.fadeInTween = Tween.createTween(this, { alpha: 1 }, {
      duration: 0.2,
      onComplete: () => {
        this.fadeOut();
      },
    });

    this.fadeInTween.start();
  }

  fadeOut() {
    this.isFadeOut = true;
    this.fadeOutTween = Tween.createTween(this, { alpha: 0 }, {
      duration: 0.5,
      delay: 0.8,
      onComplete: () => {
        this.emit(AdsBlockPopUpScreenEvent.ON_FADE_OUT);
      },
    });
    this.fadeOutTween.start();
  }

}
