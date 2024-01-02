import { Container, Sprite, Text, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { Util } from "../../helpers/utils";
import { UserData } from "../data/userData";
import { AssetSelector } from "../assetSelector";
import { PureObject } from "../../pureDynamic/core/pureObject";
import { Tween } from "../../systems/tween/tween";

export class PlayScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PLAY);
  }

  create() {
    super.create();
    this._initScore();
    this._initCherryNumber();
    this._initFx();
  }

  show() {
    super.show();
    this.updateScore(0);
    this.updateCherryNumber(UserData.cherryNumber);
  }

  resize() {
    super.resize();
    // this.scoreText.position.set(0, 0);
  }

  hide() {
    super.hide();
  }

  _initScore() {
    let bgTexture = Texture.from("score_bg");
    let pTransform = new PureTransform({
      alignment               : Alignment.CUSTOM,
      x                       : 0,
      y                       : 250,
      pivotX                  : 0.5,
      pivotY                  : 0.5,
      anchorX                 : 0.5,
      anchorY                 : 0,
      width                   : bgTexture.width,
      height                  : bgTexture.height,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.CUSTOM,
      x                       : 0,
      y                       : 150,
      pivotX                  : 0.5,
      pivotY                  : 0.5,
      anchorX                 : 0.5,
      anchorY                 : 0,
      width                   : bgTexture.width * 0.7,
      height                  : bgTexture.height * 0.7,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.scoreBg = new PureSprite(bgTexture, pTransform, lTransform);
    this.addChild(this.scoreBg.displayObject);

    this.scoreText = new Text("0", {
      fontFamily: "Arial",
      fontSize: 100,
      fill: "white",
    });
    this.scoreText.anchor.set(0.5, 0.5);
    this.scoreText.position.set(0, 0);
    this.scoreBg.displayObject.addChild(this.scoreText);
  }

  _initCherryNumber() {
    let cherryCon = Texture.from("spr_transparent");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_RIGHT,
      x         : 0,
      y         : 80,
    });
    let lTransform = new PureTransform({
      alignment : Alignment.TOP_RIGHT,
      x         : 0,
      y         : 80,
    });
    this.cherryContainer = new PureSprite(cherryCon, pTransform, lTransform);
    // this.cherryContainer.displayObject.alpha = 0;
    this.addChild(this.cherryContainer.displayObject);

    this.cherryIcon = new Sprite(AssetSelector.getCherryTexture());
    this.cherryIcon.position.set(-90, 0);
    this.cherryIcon.anchor.set(0, 0.5);
    this.cherryContainer.displayObject.addChild(this.cherryIcon);

    this.cherryText = new Text("0", {
      fontFamily: "Arial",
      fontSize: 50,
      fill: "white",
    });
    this.cherryText.x = -110;
    this.cherryText.anchor.set(1, 0.5);
    this.cherryContainer.displayObject.addChild(this.cherryText);
  }

  _initFx() {
    this.cherrryFlickFx = Tween.createTween(this.cherryIcon, { scale: {x: 1.5, y: 1.5} }, {
      duration: 0.3,
      repeat: 1,
      yoyo: true,
      onComplete: () => {
      },
    });

    this.scoreFlickFx = Tween.createTween(this.scoreText, { scale: {x: 1.3, y: 1.3} }, {
      duration: 0.2,
      repeat: 1,
      yoyo: true,
      onComplete: () => {
      },
    });
  }

  updateScore(score) {
    this.scoreText.text = score;
    this.scoreFlickFx.start();
  }

  updateCherryNumber(cherryNumber) {
    this.cherryText.text = Util.getCashFormat(cherryNumber);
    this.cherrryFlickFx.start();
  }
}