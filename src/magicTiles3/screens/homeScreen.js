import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { SongItem, SongItemEvent } from "../ui/songItemUI";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
import { Util } from "../../helpers/utils";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { SoundManager } from "../../soundManager";

export const HomeScreenEvent = Object.freeze({
  Play     : "play",
  OpenShop : "openShop",
});

export class HomeScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HOME);
  }

  create() {
    super.create();
    this._initLogo();
    this._initPlayButton();
    this._initShopUI();
    this._initVolumeUI();
    this.resize();
  }

  show() {
    super.show();
    this.resize();
    this.playPlayButtonTween();
  }

  hide() {
    super.hide();
    this.stopPlayButtonTween();
  }

  _initLogo() {
    let texture = Texture.from("spr_text_name");
    let pTransform = new PureTransform({
      alignment               : Alignment.TOP_CENTER,
      x                       : 0,
      y                       : 80,
      usePercent              : true,
      height                  : 0.25,
      width                   : 0.8,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.TOP_CENTER,
      x                       : 0,
      y                       : 50,
      usePercent              : true,
      height                  : 0.25,
      width                   : 0.8,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.logo = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.logo.displayObject);
  }

  _initPlayButton() {
    let texture = Texture.from("spr_play_button");
    let pTransform = new PureTransform({
      alignment               : Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : -100,
      usePercent              : true,
      width                   : 0.32,
      height                  : 0.19,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
      
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : 0,
      usePercent              : true,
      width                   : 0.23,
      height                  : 0.23 ,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.playButton = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.playButton.displayObject);
    Util.registerOnPointerDown(this.playButton.displayObject, this._onPlay.bind(this));
    this._initPlayButtonAnimation();
  }

  _initPlayButtonAnimation() {
    this.playButtonTween?.stop();
    this.playButtonTween = Tween.createTween(this.playButton.displayObject, { y: "+50" }, {
      duration : 1.5,
      repeat   : Infinity,
      yoyo     : true,
    }).start();
  }

  _initShopUI() {
    let texture = Texture.from("spr_shop_button");
    let pTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_RIGHT,
      x                       : -30,
      y                       : -200,
      width                   : texture.width * 0.9,
      height                  : texture.height * 0.9,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_RIGHT,
      x                       : -30,
      y                       : -200,
      width                   : texture.width * 0.8,
      height                  : texture.height * 0.8,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.shopButton = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.shopButton.displayObject);
    Util.registerOnPointerDown(this.shopButton.displayObject, this._onOpenShop.bind(this));
  }

  _initVolumeUI() {
    let texture = Texture.from("spr_volume_on");
    let pTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_RIGHT,
      x                       : -30,
      y                       : -370,
      width                   : texture.width * 0.9,
      height                  : texture.height * 0.9,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_RIGHT,
      x                       : -30,
      y                       : -370,
      width                   : texture.width * 0.8,
      height                  : texture.height * 0.8,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.volumeButton = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.volumeButton.displayObject);
    Util.registerOnPointerDown(this.volumeButton.displayObject, this._onClickVolumeButton.bind(this));
  }

  resize() {
    super.resize();
    this._initPlayButtonAnimation();

  }

  _onPlay() {
    // play click sound
    SoundManager.play("click", 1, false, 1);
    this.emit(HomeScreenEvent.Play);
  }

  _onOpenShop() {
    // play click sound
    SoundManager.play("click", 1, false, 1);
    this.emit(HomeScreenEvent.OpenShop);
  }

  _onClickVolumeButton() {
    // play click sound
    SoundManager.play("click", 1, false, 1);

    if (!Game.isMute) {
      Game.isMute = true;
      this.volumeButton.displayObject.texture = Texture.from("spr_volume_off");
      SoundManager.muteAll();
    } else {
      Game.isMute = false;
      this.volumeButton.displayObject.texture = Texture.from("spr_volume_on");
      SoundManager.unMuteAll();
    }
  }

  playPlayButtonTween() {
    this.playButtonTween?.start();
  }

  stopPlayButtonTween() {
    this.playButtonTween?.stop();
  }
}
