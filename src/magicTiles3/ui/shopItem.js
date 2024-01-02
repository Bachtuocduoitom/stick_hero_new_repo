import { Container, Sprite, Text, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { DataLocal } from "../data/dataLocal";
import { UserData } from "../data/userData";
import { DataManager } from "../data/dataManager";
import { Util } from "../../helpers/utils";
import { AssetSelector } from "../assetSelector";
import { SoundManager } from "../../soundManager";

export const ItemEvent = Object.freeze({
  Selected   : "selected",
  DeSelected : "deSelected",
  Bought     : "bought",
});

export const ItemTypes = Object.freeze({
  Hero   : "hero",
  Bridge : "bridge",
});

export class ShopItem extends PIXI.Container {
  constructor(data = {}) {
    super();
    this.id = data.id || 0;
    this.skinName = data.skin || "";
    this.priceNumber = data.price || 0;
    
    this._create();
    this.updateData(data);
  }

  _create() {
    this._initLockedCard();
    this._initUnlockedCard();
  }

  _initLockedCard() {
    let texture = Texture.from("spr_shop_item_locked");
    let pTransform = new PureTransform({
      useOriginalSize: true,
    });
    this.lockedCard = new PureSprite(texture, pTransform);
    this.addChild(this.lockedCard.displayObject);

    this._initPriceContainer();

    Util.registerOnPointerDown(this.lockedCard.displayObject, () => {
      if (UserData.cherryNumber < this.priceNumber) {
        return;
      }
      this.bought();
      //play click sound
      SoundManager.play("click", 1, false, 1);
    });
  }

  _initUnlockedCard() {
    let texture = Texture.from("spr_shop_item_unlocked");
    let pTransform = new PureTransform({
      useOriginalSize: true,
    });
    this.unlockedCard = new PureSprite(texture, pTransform);
    this.addChild(this.unlockedCard.displayObject);

    this._initSkin();

    Util.registerOnPointerDown(this.unlockedCard.displayObject, () => {
      this.onSelect();
      //play click sound
      SoundManager.play("click", 1, false, 1);
    });
  }

  updateData(data) {
    // this.id = data.id;
    // this.skinName = data.skin;
    // this.priceNumber = data.price;

    this.skin.texture = Texture.from(this.skinName);
    this.price.text = this.priceNumber;

    if (data.isUnlock) {
      if (this.id == UserData.currentSkin) {
        this.onSelect();
      } else {
        this.onUnlock();
      }
    }
    else {
      this.onLock();
    }
  }

  resize() {
    
  }

  bought() {
    DataLocal.listHeroSkinUnlock.push(this.id);
    DataLocal.updateListHeroSkinUnlockData(DataLocal.listHeroSkinUnlock);
    UserData.cherryNumber -= this.priceNumber;
    DataLocal.updateCherryNumberData(UserData.cherryNumber);
    DataManager.updateListHeroSkin();
    this.emit(ItemEvent.Bought, this.id);
    this.onSelect();
  }

  onUnlock() {
    this.lockedCard.displayObject.visible = false;
    this.unlockedCard.displayObject.visible = true;
  }

  onLock() {
    this.lockedCard.displayObject.visible = true;
    this.unlockedCard.displayObject.visible = false;
  }

  onSelect() {
    this.emit(ItemEvent.Selected, this.id);
    this.lockedCard.displayObject.visible = false;
    this.unlockedCard.displayObject.visible = true;
    this.unlockedCard.displayObject.texture = Texture.from("spr_shop_item_selected");
  }

  onDeselect() {
    this.emit(ItemEvent.DeSelected, this.id);
    this.lockedCard.displayObject.visible = false;
    this.unlockedCard.displayObject.visible = true;
    this.unlockedCard.displayObject.texture = Texture.from("spr_shop_item_unlocked");
  }

  _initPriceContainer() {
    this.priceContainer = new Container();
    this.lockedCard.displayObject.addChild(this.priceContainer);

    this.price = new Text(this.price, {
      fontFamily: "Arial",
      fontSize: 70,
      fill: "white",
      align: "center",
    });
    this.price.anchor.set(1, 0.5);
    this.price.position.set(this.lockedCard.displayObject.width/2 + 10, this.lockedCard.displayObject.height/2);
    this.priceContainer.addChild(this.price);

    let cherryIcon = new Sprite(AssetSelector.getCherryTexture());
    cherryIcon.position.set(this.lockedCard.displayObject.width/2 + 30, this.lockedCard.displayObject.height/2);
    cherryIcon.anchor.set(0, 0.5);
    this.priceContainer.addChild(cherryIcon);
  }

  _initSkin() {
    let texture = Texture.from(this.skinName);
    this.skin = new Sprite(texture);
    this.skin.anchor.set(0.5, 0.5);
    this.skin.scale.set(1.3);
    this.skin.position.set(this.unlockedCard.displayObject.width/2, this.unlockedCard.displayObject.height/2);
    this.unlockedCard.displayObject.addChild(this.skin);
  }

  destroy() {
    super.destroy();
    GameResizer.unregisterOnResizeCallback(this.resize, this);
  }

}
