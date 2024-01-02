import { ScrollView } from "../../pureDynamic/core/scrollView/scrollView";
import { DataLocal } from "../data/dataLocal";
import { DataManager } from "../data/dataManager";
import { UserData } from "../data/userData";
import { ItemEvent, ShopItem } from "./shopItem";

export const ListItemEvent = Object.freeze({
  ItemListSelected  : "itemListSelected",
  ItemListBought    : "itemListBought",
});

export class ListItem extends ScrollView {
  constructor (width = 0, height = 0) {
    super({
      width                   : width,
      height                  : height,
      background              : 0x000000,
      elementsMargin          : 50,
      vertPadding             : 0,
      horPadding              : 0,
      disableDynamicRendering : true,
    });

    this._create();
    this._initSkinCards();
  }

  _create () {
    this.itemList = [];
    this.background.alpha = 0;
    this.heroSkinList = DataManager.heroSkinData;
  }

  _initSkinCards() {
    this.heroSkinList.forEach((skin) => {
      let item = new ShopItem(skin);
      this.itemList.push(item);
      this.addItem(item);

      item.on(ItemEvent.Selected, (id) => {
        this.itemList.forEach((oldItem) => {
          if (oldItem.id == UserData.currentSkin) {
            oldItem.onDeselect();
          }
        });
        UserData.currentSkin = id;
        DataLocal.updateCurrentSkinData(id);
        this.emit(ListItemEvent.ItemListSelected, id);
      });
      item.on(ItemEvent.Bought, (id) => {
        this.itemList.forEach((oldItem) => {
          if (oldItem.id == UserData.currentSkin) {
            oldItem.onDeselect();
          }
        });
        UserData.currentSkin = id;
        DataLocal.updateCurrentSkinData(id);
        this.emit(ListItemEvent.ItemListBought, id);
      });
    });
  }

  show() {
    this.visible = true;
    this.scrollTop();
  }

  hide() {
      this.visible = false;
  }
}