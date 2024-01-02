import { Sprite, Text, TextStyle, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { SoundManager } from "../../soundManager";
import { AssetSelector } from "../assetSelector";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameSetting } from "../gameSetting";
import { PureRect } from "../../pureDynamic/PixiWrapper/pureRect";
import { Tween } from "../../systems/tween/tween";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { UserData } from "../data/userData";
import { Util } from "../../helpers/utils";
import { ShopItem } from "../ui/shopItem";
import { ListItem, ListItemEvent } from "../ui/listItem";
import { Sound } from "@pixi/sound";

export const ShopScreenEvent = Object.freeze({
  Close     : "close",
});

export class ShopScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_SHOP);
  }

  create() {
    super.create();
    this._initBackground();
    this._initShopTable();

    this.resize();  
  }

  show() {
    super.show();
    this.updateCherryNumber(UserData.cherryNumber);
  }

  resize() {
    super.resize();
    this.shopList.resize();
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

    Util.registerOnPointerDown(this.bg.displayObject, this._onClose.bind(this));
  }

  _initShopTable() {
    let tableTextture = Texture.from("spr_shop_table");
    let pTransform = new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : -100,
    });
    let lTransform = new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : 0,
      width                   : tableTextture.width * 0.8,
      height                  : tableTextture.height * 0.8,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.shopTable = new PureSprite(tableTextture, pTransform, lTransform);
    Util.registerOnPointerDown(this.shopTable.displayObject, () => { });
    this.addChild(this.shopTable.displayObject);

    this._initCherryNumber();
    this._initShopList();
  }

  _initCherryNumber() {
    let cherryIcon = new Sprite(AssetSelector.getCherryTexture());
    cherryIcon.position.set(400, - 530);
    cherryIcon.anchor.set(0.5, 0.5);
    cherryIcon.scale.set(1.3, 1.3);
    this.shopTable.displayObject.addChild(cherryIcon);

    this.cherryText = new Text("0", {
      fontFamily: "Arial",
      fontSize: 60,
      fill: "white",
    });
    this.cherryText.x = cherryIcon.x - 60;
    this.cherryText.y = cherryIcon.y
    this.cherryText.anchor.set(1, 0.5);
    this.shopTable.displayObject.addChild(this.cherryText);
  }

  _initShopList() {
    this.shopList = new ListItem(1000, 950);
    this.shopList.pivot.set(0.5, 0.5);
    this.shopList.position.set(-430, -400);
    this.shopTable.displayObject.addChild(this.shopList);

    this.shopList.on(ListItemEvent.ItemListBought, (id) => {
      this.updateCherryNumber(UserData.cherryNumber);
    });
    

  }

  _onClose() {
    SoundManager.play("click");
    this.emit(ShopScreenEvent.Close);
  }

  updateCherryNumber(cherryNumber) {
    this.cherryText.text = Util.getCashFormat(cherryNumber);
  }
}
