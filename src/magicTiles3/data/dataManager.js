
import { DataLocal } from "./dataLocal";
import { UserData } from "./userData";
import heroSkinData from "../../../assets/jsons/heroSkinData.json";
export class DataManager {
  static init() {
    this.heroSkinData = heroSkinData;
    UserData.init();
    this.updateListHeroSkin();
  }

  static updateListHeroSkin() {
    for (let i = 0; i < this.heroSkinData.length; i++) {
      for (let j = 0; j < UserData.listHeroSkinUnlock.length; j++) {
        if (this.heroSkinData[i].id === UserData.listHeroSkinUnlock[j]) {
          this.heroSkinData[i].isUnlock = true;
          break;
        }
      }
    }
  }
}
