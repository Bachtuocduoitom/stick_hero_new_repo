import { Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { DataLocal } from "../data/dataLocal";
import { UserData } from "../data/userData";
import { DataManager } from "../data/dataManager";
import { Util } from "../../helpers/utils";

export const SongItemEvent = Object.freeze({
  Selected   : "Selected",
  DeSelected : "DeSelected",
  Bought     : "bought",
});
export class SongItem extends PIXI.Container {
  constructor(data = {}) {
    super("songItemUI");
    this.id = data.id || 0;
    this.spriteAsset = data.spriteAsset;

    let texture = Texture.from("spr_song_bg");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : GameResizer.width,
      height    : 250,
    });

    let lTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : GameResizer.width,
      height    : 250,
      pivotX    : 0.5,
      pivotY    : 0.5,
    });
    this.bg = new PureSprite(texture, pTransform, lTransform);
    this.bg.displayObject.alpha = 0;
    this.addChild(this.bg.displayObject);

    this._initBgSong();
    this._initIcon();
    this._initSongName();
    this._initAuthorText();
    this._initButtonPlay();
    this._initButtonBuy();
    GameResizer.registerOnResizeCallback(this.resize, this);
  }

  _initBgSong() {
    let texture = Texture.from("spr_song_bg");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 600,
      height    : 250,
    });

    let lTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 600,
      height    : 250,
      pivotX    : 0.5,
      pivotY    : 0.5,
    });
    this.bg2 = new PureSprite(texture, pTransform, lTransform);
    // this.bg.displayObject.alpha = 0;
    this.addChild(this.bg2.displayObject);
  }

  updateData(data) {
    this.id = data.id;
    this.spriteAsset = data.icon;
    this.price = data.price;
    this.songName.displayObject.text = data.name;
    this.authorText.displayObject.text = data.author;
    this.icon.displayObject.texture = Texture.from(data.icon);
    this.priceText.displayObject.text = data.price;
    if (data.isUnlock) {
      this.onUnlock();
    }
    else {
      this.onLock();
    }
  }

  resize() {
    this.songName.x = this.icon.x + 200;
    this.songName.y = 40;
    this.authorText.x = this.songName.x;
    this.authorText.y = this.songName.y + 100;
    this.buttonPlay.x = this.authorText.x + 400;
    this.buttonPlay.y = this.authorText.y;
  }

  destroy() {
    super.destroy();
    GameResizer.unregisterOnResizeCallback(this.resize, this);
  }

  _initIcon() {
    let texture = Texture.from("1015");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 250,
      height    : 250,
      x         : -270,
      pivotX    : 0.5,
      pivotY    : 0.5,
    });

    let lTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 250,
      height    : 250,
      x         : -270,
      pivotX    : 0.5,
      pivotY    : 0.5,
    });
    this.icon = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.icon.displayObject);
  }

  _initSongName() {
    let transform = new PureTransform({
      alignment       : Alignment.TOP_LEFT,
      useOriginalSize : true,
      pivotX          : 1,
    });
    let style = new PIXI.TextStyle({
      fontSize   : 60,
      align      : "center",
      fill       : 0xFFFFFF,
      fontWeight : "bold",
    });
    this.songName = new PureText("0", transform, style);
    this.songName.x = this.icon.x + 200;
    this.songName.y = 40;
    this.addChild(this.songName.displayObject);
  }

  _initAuthorText() {
    let transform = new PureTransform({
      alignment       : Alignment.TOP_LEFT,
      useOriginalSize : true,
    });
    let style = new PIXI.TextStyle({
      fontSize : 40,
      align    : "center",
      fill     : "#3da1ff",
    });
    this.authorText = new PureText("0", transform, style);
    this.authorText.x = this.songName.x;
    this.authorText.y = this.songName.y + 100;
    this.addChild(this.authorText.displayObject);
  }

  _initButtonPlay() {
    let texture = Texture.from("spr_fh_btn");
    this.buttonPlay = new PureSprite(texture, new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 255,
      height    : 90,
    }), new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 255,
      height    : 90,
    }));
    this.buttonPlay.x = this.authorText.x + 400;
    this.buttonPlay.y = this.authorText.y;
    this.addChild(this.buttonPlay.displayObject);

    let transform = new PureTransform({
      useOriginalSize : true,
    });
    let style = new PIXI.TextStyle({
      fontSize : 50,
      align    : "center",
      fill     : "#303030",
      fontWeight : "bold",
    });
    this.playText = new PureText("Play", transform, style);
    this.playText.x = -50;
    this.playText.y = 30;
    this.buttonPlay.displayObject.addChild(this.playText.displayObject);

    Util.registerOnPointerDown(this.buttonPlay.displayObject, () => {
      this.onSelect();
    });
  }

  _initButtonBuy() {
    let texture = Texture.from("spr_btn1");
    this.buttonBuy = new PureSprite(texture, new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 255,
      height    : 90,
    }), new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : 255,
      height    : 90,
    }));
    this.buttonBuy.x = this.buttonPlay.x;
    this.buttonBuy.y = this.buttonPlay.y;
    this.addChild(this.buttonBuy.displayObject);

    let textureDiamond = Texture.from("spr_icon_diamond");
    this.iconDiamon = new PureSprite(textureDiamond, new PureTransform({
     usePercent: true,
     width : 60,
     height: 50,
    }), new PureTransform({
      usePercent: true,
      width : 60,
      height: 50,
    }));
    this.iconDiamon.x = -120;
    this.iconDiamon.y = 30;
    this.buttonBuy.displayObject.addChild(this.iconDiamon.displayObject);

    let transform = new PureTransform({
      useOriginalSize : true,
    });
    let style = new PIXI.TextStyle({
      fontSize : 50,
      align    : "center",
      fill     : 0xFFFFFF,
    });
    this.priceText = new PureText("10000", transform, style);
    this.priceText.x = -40;
    this.priceText.y = 30;
    this.buttonBuy.displayObject.addChild(this.priceText.displayObject);


    Util.registerOnPointerDown(this.buttonBuy.displayObject, () => {
      if (this.price > UserData.currency) {
        return;
      }
      this.unlock();
    });
  }

  unlock() {
    DataLocal.listSongUnlock.push(this.id);
    DataLocal.updateListSongUnlockData(DataLocal.listSongUnlock);
    UserData.currency -= this.price;
    DataLocal.updateCurrencyData(UserData.currency);
    DataManager.updateListSong();
    this.emit(SongItemEvent.Bought, this.id);
    this.onUnlock();
  }

  onLock() {
    this.buttonPlay.visible = false;
    this.buttonBuy.visible = true;
    // this.buttonPlay.button.active = false;
  }

  onUnlock() {
    this.buttonPlay.visible = true;
    this.buttonBuy.visible = false;
    // this.buttonPlay.button.active = true;
  }

  onSelect() {
    this.emit(SongItemEvent.Selected, this.id);
  }

  onDeselect() {
    this.emit(SongItemEvent.DeSelected, this.id);
  }
}
