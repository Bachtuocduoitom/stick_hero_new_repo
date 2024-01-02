import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { SongItem, SongItemEvent } from "../ui/songItemUI";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
import { SoundManager } from "../../soundManager";
import { AdsManager, AdsType } from "../../../sdk/adsManager";
import { CherryExplosionFx } from "../gameObjects/effect/cherryExplosionFx";
import { Tween } from "../../systems/tween/tween";

export const EndScreenEvent = Object.freeze({
  BackHome            : "backHome",
  Restart             : "restart",
  ShowRank            : "showRank",
  PlayAds             : "playAds",
  ShowAdsBlockPopUp   : "showAdsBlockPopUp",
  ShowAdsInvalidPopUp : "showAdsInvalidPopUp",
  ShowSkipRewardPopUp : "showSkipRewardPopUp",
});

export class EndScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOSE);
    this.buttons = [];
  }

  create() {
    super.create();
    this._initBackground();
    this._initGameOverAnnouncement();
    this._initScoreTable();
    this._initBottom();
    this._addCherryExplosionFx();
    this._addChangeAdsButtonTextureTween();
  }

  show() {
    super.show();
    this.updateBestScore(UserData.bestScore);
    this.resetAdsButton();
  }

  hide() {
    super.hide();
  }

  _initBackground() {
    let pTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(Texture.WHITE, pTransform);
    this.addChild(this.bg.displayObject);

    this.bg.displayObject.tint = 0x000000;
    this.bg.displayObject.alpha = 0.75;
  }

  _initGameOverAnnouncement() {
    let gameOverTexture = Texture.from("spr_game_over");
    let pTransform = new PureTransform({
      alignment                : Alignment.TOP_CENTER,
      x                        : 0,
      y                        : 150,
      usePercent               : true,
      with                     : 0.3,
      height                   : 0.1,
      maintainAspectRatioType  : MaintainAspectRatioType.MIN,
      useOriginalAspectRation  : true,
    });
    let lTransform = new PureTransform({
      alignment                : Alignment.TOP_CENTER,
      x                        : 0,
      y                        : 100,
      usePercent               : true,
      with                     : 0.3,
      height                   : 0.3,
      maintainAspectRatioType  : MaintainAspectRatioType.MIN,
    });
    this.gameOverAnnouncement = new PureSprite(gameOverTexture, pTransform, lTransform);
    this.addChild(this.gameOverAnnouncement.displayObject);
  }

  _initScoreTable() {
    let tableTextture = Texture.from("spr_table_score");
    let pTransform = new PureTransform({
      alignment               : Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : -100,
      usePercent              : true,
      width                   : 0.8,
      height                  : 0.35,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : -50,
      width                   : tableTextture.width * 0.6,
      height                  : tableTextture.height * 0.6,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.scoreTable = new PureSprite(tableTextture, pTransform, lTransform);
    this.addChild(this.scoreTable.displayObject);

    this.scoreText = new Text("SCORE", {
      fontFamily: "Arial",
      fontSize: 70,
      fill: "black",
      align: "center",
    });
    this.scoreText.anchor.set(0.5, 0.5);
    this.scoreText.position.set(0, - 200);
    this.scoreTable.displayObject.addChild(this.scoreText);

    this.score = new Text("0", {
      fontFamily: "Arial",
      fontSize: 100,
      fill: "black",
      align: "center",
    });
    this.score.anchor.set(0.5, 0.5);
    this.score.position.set(0, this.scoreText.y + 120);
    this.scoreTable.displayObject.addChild(this.score);

    this.bestScoreText = new Text("BEST", {
      fontFamily: "Arial",
      fontSize: 70,
      fill: "black",
      align: "center",
    });
    this.bestScoreText.anchor.set(0.5, 0.5);
    this.bestScoreText.position.set(0, 100);
    this.scoreTable.displayObject.addChild(this.bestScoreText);

    this.bestScore = new Text("0", {
      fontFamily: "Arial",
      fontSize: 100,
      fill: "black",
      align: "center",
    });
    this.bestScore.anchor.set(0.5, 0.5);
    this.bestScore.position.set(0, this.bestScoreText.y + 120);
    this.scoreTable.displayObject.addChild(this.bestScore);
  }

  _initBottom() {
    let bottomTexture = Texture.from("spr_transparent");
    let pTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_CENTER,
      x                       : 0,
      y                       : -250,
      usePercent              : true,
      width                   : 0.33,
      height                  : 0.08,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment              : Alignment.BOTTOM_CENTER,
      x                       : 0,
      y                       : -150,
      usePercent              : true,
      width                   : 0.13,
      height                  : 0.1,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.bottom = new PureSprite(bottomTexture, pTransform, lTransform);
    this.addChild(this.bottom.displayObject);

    this.restartButton = new Sprite(Texture.from("spr_replay_button"));
    this.restartButton.anchor.set(0.5, 0.5);
    // this.restartButton.position.set(-220, 0);
    this.restartButton.position.set(-120, 0);
    this.bottom.displayObject.addChild(this.restartButton);
    this.buttons.push(this.restartButton);
    Util.registerOnPointerDown(this.restartButton, this._onRestart.bind(this));

    this.homeButton = new Sprite(Texture.from("spr_home_button"));
    this.homeButton.anchor.set(0.5, 0.5);
    // this.homeButton.position.set(0, 0);
    this.homeButton.position.set(120, 0);
    this.bottom.displayObject.addChild(this.homeButton);
    this.buttons.push(this.homeButton);
    Util.registerOnPointerDown(this.homeButton, this._onBackHome.bind(this));

    this.rankButton = new Sprite(Texture.from("spr_rank_button"));
    this.rankButton.anchor.set(0.5, 0.5);
    this.rankButton.position.set(220, 0);
    // this.bottom.displayObject.addChild(this.rankButton);
    this.buttons.push(this.rankButton);
    Util.registerOnPointerDown(this.rankButton, this._onShowRank.bind(this));

    this.bonusCherryButton = new Sprite(Texture.from("spr_bonus_cherry_button"));
    this.bonusCherryButton.anchor.set(0.5, 0.5);
    this.bonusCherryButton.position.set(0, -200);
    this.bottom.displayObject.addChild(this.bonusCherryButton);
    this.buttons.push(this.bonusCherryButton);
    Util.registerOnPointerDown(this.bonusCherryButton, this._onPlayAds.bind(this));
  }

  resize() {
    super.resize();
  }

  _onBackHome() {
    //play click sound
    SoundManager.play("click", 1, false, 1);
    this.emit(EndScreenEvent.BackHome, this);
  }

  _onRestart() {
    //play click sound
    SoundManager.play("click", 1, false, 1);
    this.emit(EndScreenEvent.Restart, this);
  }

  _onShowRank() {
    //play click sound
    SoundManager.play("click", 1, false, 1);
    this.emit(EndScreenEvent.ShowRank, this);
  }

  _onPlayAds() {
    this.disableAllButton();

    //play click sound
    SoundManager.play("click", 1, false, 1);
    this.emit(EndScreenEvent.PlayAds, this);
    AdsManager.hasAdblock((hasAdblock) => {
      if (hasAdblock) {
        this.enableAllButton();
        this.emit(EndScreenEvent.ShowAdsBlockPopUp);
        return;
      }
      AdsManager.showVideo(
        AdsType.REWARDED,
        () => {   },
        () => {
          this.enableAllButton();
          this._playCherryExplosionFx();
          UserData.cherryNumber += 20;
          DataLocal.updateCherryNumberData(UserData.cherryNumber);
          this._changeAdsButtonTexture();
          
        },
        (err) => {
          this.enableAllButton();
          if (err.breakType === "dismissed") {
            this.emit(EndScreenEvent.ShowSkipRewardPopUp);
          } else {
            this.emit(EndScreenEvent.ShowAdsInvalidPopUp);
          }
        },
      );
    });
  }

  resetAdsButton() {
    this.bonusCherryButton.texture = Texture.from("spr_bonus_cherry_button");
    this.bonusCherryButton.eventMode = "static";
  }

  updateScore(score) {
    this.score.text = score;
  }

  updateBestScore(score) {
    this.bestScore.text = score;
  }

  disableAllButton() {
    this.buttons.forEach(button => {
      button.eventMode = "none";
    });
  }

  enableAllButton() {
    this.buttons.forEach(button => {
      button.eventMode = "static";
    });
  }

  _addCherryExplosionFx() {
    this.cherryExplosionFx = new CherryExplosionFx();
    this.bonusCherryButton.addChild(this.cherryExplosionFx);
  }

  _addChangeAdsButtonTextureTween() {
    this.changeAdsButtonTextureTween = Tween.createCountTween({
      duration: 1,
      onStart: () => {
        SoundManager.play("eat_cherry", 1, true, 3);
      },
      onComplete: () => {
        this.bonusCherryButton.texture = Texture.from("spr_plus_20_cherry_button");
        this.bonusCherryButton.eventMode = "none";
        SoundManager.stop("eat_cherry");
      },
    });
  }

  _playCherryExplosionFx() {
    this.cherryExplosionFx.play();
  }

  _changeAdsButtonTexture() { 
    this.changeAdsButtonTextureTween.start();
  }
}
